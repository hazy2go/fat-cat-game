const { Client, GatewayIntentBits, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle, REST, Routes } = require('discord.js');
require('dotenv').config();

const client = new Client({
  intents: [GatewayIntentBits.Guilds]
});

const ACTIVITY_URL = `https://discord.com/activities/${process.env.DISCORD_CLIENT_ID}`;
const WORDLE_ACTIVITY_URL = `https://discord.com/activities/${process.env.DISCORD_CLIENT_ID}`;

// Register slash commands
const commands = [
  {
    name: 'fatcat',
    description: 'Start the Fat Cat Game activity!',
  },
  {
    name: 'ochako',
    description: 'Play Ochako\'s Kitchen - A Victorian ingredient guessing game!',
  }
];

client.once('ready', async () => {
  console.log(`✅ Bot logged in as ${client.user.tag}`);

  // Register commands
  const rest = new REST({ version: '10' }).setToken(process.env.DISCORD_BOT_TOKEN);

  try {
    console.log('📝 Registering slash commands...');

    // Get existing commands to preserve Entry Point commands
    const existingCommands = await rest.get(
      Routes.applicationCommands(process.env.DISCORD_CLIENT_ID)
    );

    // Find if our commands already exist
    const fatcatCommand = existingCommands.find(cmd => cmd.name === 'fatcat');
    const ochakoCommand = existingCommands.find(cmd => cmd.name === 'ochako');

    if (!fatcatCommand) {
      // Create new command (POST instead of PUT to avoid removing Entry Point)
      await rest.post(
        Routes.applicationCommands(process.env.DISCORD_CLIENT_ID),
        { body: commands[0] }
      );
      console.log('✅ /fatcat command registered!');
    } else {
      console.log('✅ /fatcat command already exists!');
    }

    if (!ochakoCommand) {
      // Create ochako command
      await rest.post(
        Routes.applicationCommands(process.env.DISCORD_CLIENT_ID),
        { body: commands[1] }
      );
      console.log('✅ /ochako command registered!');
    } else {
      console.log('✅ /ochako command already exists!');
    }
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

  if (interaction.commandName === 'ochako') {
    const embed = new EmbedBuilder()
      .setTitle('🍳 Ochako\'s Kitchen')
      .setDescription('*~ Victorian Fish Cookery ~*\n\nHelp Chef Ochako find the secret ingredients for her famous fish dishes!\n\n**How to play:**\n• Guess the 5-letter ingredient\n• 🟩 Green = Correct letter & position\n• 🟨 Yellow = Correct letter, wrong position\n• ⬛ Gray = Letter not in word\n• You have 6 guesses per round!')
      .setColor('#722F37')
      .setThumbnail('https://i.ibb.co/LFXKt1p/Gemini-Generated-Image-my3tyqmy3tyqmy3t.png')
      .addFields(
        { name: '📝 Guesses', value: '6 per round', inline: true },
        { name: '💡 Hints', value: 'Available (-150 pts)', inline: true },
        { name: '🏆 Leaderboard', value: 'Compete for top chef!', inline: true }
      )
      .setFooter({ text: 'Est. 1887 ~ Fine Fish Cuisine' });

    const button = new ButtonBuilder()
      .setLabel('🎮 Play Ochako\'s Kitchen')
      .setURL(WORDLE_ACTIVITY_URL)
      .setStyle(ButtonStyle.Link);

    const row = new ActionRowBuilder().addComponents(button);

    await interaction.reply({
      embeds: [embed],
      components: [row]
    });
  }
});

client.login(process.env.DISCORD_BOT_TOKEN);
