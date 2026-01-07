const { Client, GatewayIntentBits, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle, REST, Routes } = require('discord.js');
require('dotenv').config();

const client = new Client({
  intents: [GatewayIntentBits.Guilds]
});

const ACTIVITY_URL = `https://discord.com/activities/${process.env.DISCORD_CLIENT_ID}`;

// Register slash command
const commands = [
  {
    name: 'fatcat',
    description: 'Start the Fat Cat Game activity!',
  }
];

client.once('ready', async () => {
  console.log(`✅ Bot logged in as ${client.user.tag}`);

  // Register commands
  const rest = new REST({ version: '10' }).setToken(process.env.DISCORD_BOT_TOKEN);

  try {
    console.log('📝 Registering slash commands...');
    await rest.put(
      Routes.applicationCommands(process.env.DISCORD_CLIENT_ID),
      { body: commands }
    );
    console.log('✅ Slash commands registered!');
  } catch (error) {
    console.error('❌ Error registering commands:', error);
  }
});

client.on('interactionCreate', async interaction => {
  if (!interaction.isChatInputCommand()) return;

  if (interaction.commandName === 'fatcat') {
    const embed = new EmbedBuilder()
      .setTitle('🐱 Fat Cat Game')
      .setDescription('Keep the cat healthy by maintaining the perfect weight!\n\n**Goal:** Keep the cat in the optimal weight range (45-65) for 6 hours to earn a server buff!\n\n**How to play:**\n• Feed sardines to increase weight (+8)\n• Weight decays over time (-0.5 per minute)\n• Work together with your server!')
      .setColor('#764ba2')
      .addFields(
        { name: '😻 Optimal Weight', value: '45-65', inline: true },
        { name: '⏰ Block Duration', value: '6 hours', inline: true },
        { name: '🎁 Reward', value: '+5% Server Buff', inline: true }
      )
      .setImage('https://raw.githubusercontent.com/hazy2go/fat-cat-game/main/assets/cat-normal.jpg')
      .setFooter({ text: 'Click the button below to start playing!' });

    const button = new ButtonBuilder()
      .setLabel('🎮 Play Fat Cat Game')
      .setURL(ACTIVITY_URL)
      .setStyle(ButtonStyle.Link);

    const row = new ActionRowBuilder().addComponents(button);

    await interaction.reply({
      embeds: [embed],
      components: [row]
    });
  }
});

client.login(process.env.DISCORD_BOT_TOKEN);
