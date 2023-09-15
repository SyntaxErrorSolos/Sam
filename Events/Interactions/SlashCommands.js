const {
  ChatInputCommandInteraction,
  DMChannel,
  ChannelType,
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  EmbedBuilder,
} = require("discord.js");
const talkedRecently = new Set();

//imports
const guildAccount = require("../Account/guildAccount");
const userAccount = require("../Account/userAccount");

module.exports = {
  name: "interactionCreate",
  /**
   *
   * @param { ChatInputCommandInteraction } interaction
   */
  async execute(interaction, client) {
    if (!interaction.guild)
      return interaction.reply({
        content: "Commands can only be used in a server",
      });




    if (interaction.isStringSelectMenu()) {
      if (interaction.customId === "help") {
        const value = interaction.values
        let choice = `${value}`
        if (choice === 'misc') return interaction.reply({ content: "**__Miscellaneous commands__**\n/growth - Check your server's member growth\n/reminder - Set a custom reminder\n/ping - View the bot's latency", ephemeral: true })
        if (choice === 'automoderation') return interaction.reply({ content: "**__AutoModeration__**\n/anti toxicity - Prevent toxic / harmful messages\n/anti phishing - Block phishing links\n/anti nsfw - Block NSFW content", ephemeral: true })
        if (choice === 'config') return interaction.reply({ content: "**__Configuration-based commands__**\n/settings - View the current settings\n/guild tokens - View the remaining tokens\n/auto tips - Get helpful tips based on the server's growth ever week\n/chatbot - Manage the chatbot", ephemeral: true })
      }
    }
    if (!interaction.isChatInputCommand()) return;
    const command = client.commands.get(interaction.commandName);
    if (!command) {
      return interaction.reply({ content: "Unable to find given command!" });
    }

    if (command.developer && interaction.user.id !== ("642308656217456641")) {
      return interaction.reply({
        content:
          "Command marked as developer only\n**__Common Reasons__**\n> Command let's users access sensitive data\n> Command is in beta / development\n> Command is private",
      });
    }

    if (talkedRecently.has(interaction.user.id)) {
      interaction.reply(
        "You're currently on a 5 second cooldown!"
      );
    } else {

      const findGuild = await guildAccount.findOne({ guildID: interaction.guild.id })
      const findUser = await userAccount.findOne({ userID: interaction.user.id })
      if (!findGuild) return;
      if (!findUser) await userAccount.create({ userID: interaction.user.id, Tokens: 300 })
      
      command.execute(interaction, client);

    }
    talkedRecently.add(interaction.user.id);
    setTimeout(() => {
      // Removes the user from the set after a minute
      talkedRecently.delete(interaction.user.id);
    }, 5000);
  },
};
