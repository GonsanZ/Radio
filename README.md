📻 BOT DE RADIO – FUNCIONALIDADES COMPLETAS:

✅ 1. Reproduce audio de Snapcast en canales de voz

- Usa FFmpeg para decodificar el stream TCP desde Snapcast.
- Transmite el audio directamente al canal de voz de Discord.
-  Compatible con cualquier fuente de Snapcast (TCP, HTTP, etc.).

🎚️ 2. Selector de estaciones con menú interactivo:

- Comando /snapcast muestra un menú desplegable con estaciones disponibles.

    Cada estación tiene:

- Un nombre visible (ej: 🎵 Música, 📰 Noticias, 🌙 Chill).
- Una URL de stream (ej: tcp://127.0.0.1:4953).
- El usuario elige la estación y el bot se conecta automáticamente al canal de voz.
	
⚙️ 5. Tecnologías y librerías utilizadas

- discord.js v14.x (para el bot y comandos de barra)
- @discordjs/voice (para conexiones de voz)
- FFmpeg (para procesar el stream de Snapcast)
- child_process.spawn (para ejecutar FFmpeg desde Node.js)
- Snapcast (como servidor de audio multihabitación)
