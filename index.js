const { Client, Collection, GatewayIntentBits, Events } = require('discord.js');
const { joinVoiceChannel, createAudioPlayer, createAudioResource } = require('@discordjs/voice');
const { spawn } = require('child_process');
const fs = require('fs');
const path = require('path');
const config = require('./config.json');

const client = new Client({
  intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildVoiceStates],
});

client.commands = new Collection();

// Carga de comandos
const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));
for (const file of commandFiles) {
  const command = require(`./commands/${file}`);
  client.commands.set(command.data.name, command);
}

client.once(Events.ClientReady, () => {
  console.log(`✅ Conectado como ${client.user.tag}`);
});

client.on(Events.InteractionCreate, async interaction => {
  if (interaction.isChatInputCommand()) {
    const command = client.commands.get(interaction.commandName);
    if (!command) return;
    await command.execute(interaction);
  }

  if (interaction.isStringSelectMenu()) {
    if (interaction.customId === 'select_station') {
      const selected = interaction.values[0];
      const station = config.stations[selected];
      if (!station) return interaction.reply({ content: '❌ Estación no válida.', ephemeral: true });

      const channel = interaction.member.voice.channel;
      if (!channel) {
        return interaction.reply({ content: '❌ Debes estar en un canal de voz.', ephemeral: true });
      }

      const connection = joinVoiceChannel({
        channelId: channel.id,
        guildId: interaction.guild.id,
        adapterCreator: interaction.guild.voiceAdapterCreator,
      });

      const ffmpeg = spawn('ffmpeg', [
        '-i', station.url,
        '-f', 's16le',
        '-ar', '48000',
        '-ac', '2',
        'pipe:1',
      ]);

      const resource = createAudioResource(ffmpeg.stdout, { inputType: 'raw' });
      const player = createAudioPlayer();
      player.play(resource);
      connection.subscribe(player);

      client.voiceConnection = connection;
      client.audioPlayer = player;

      await interaction.update({
        content: `📡 Conectado a la estación: **${station.name}**`,
        components: [],
      });
    }
  }

  if (interaction.isButton()) {
    if (interaction.customId === 'stop_snapcast') {
      if (client.voiceConnection) {
        client.voiceConnection.destroy();
        client.audioPlayer.stop();
        interaction.reply({ content: '🛑 Reproducción detenida.', ephemeral: true });
      }
    }
  }
});

client.login(config.token);
