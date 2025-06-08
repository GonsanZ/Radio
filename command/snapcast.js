const { SlashCommandBuilder, ActionRowBuilder, StringSelectMenuBuilder } = require('discord.js');
const config = require('../config.json');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('snapcast')
    .setDescription('Elige una estación de Snapcast para reproducir en el canal de voz'),

  async execute(interaction) {
    const options = Object.entries(config.stations).map(([key, value]) => ({
      label: value.name,
      value: key,
    }));

    const select = new StringSelectMenuBuilder()
      .setCustomId('select_station')
      .setPlaceholder('Selecciona una estación')
      .addOptions(options);

    const row = new ActionRowBuilder().addComponents(select);

    await interaction.reply({
      content: '🎧 Elige una estación para comenzar a reproducir:',
      components: [row],
    });
  },
};
