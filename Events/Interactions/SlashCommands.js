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

module.exports = {
  name: "interactionCreate",
  /**
   *
   * @param { ChatInputCommandInteraction } interaction
   */
  execute(interaction, client) {
    if (!interaction.guild)
      return interaction.reply({
        content: "Commands can only be used in a server",
      });
    if (interaction.isStringSelectMenu()) {
      if (interaction.customId === "help") {
        const value = interaction.values
        let choice = `${value}`
        if (choice === 'misc') return interaction.reply({ content: "**__Miscellaneous commands__**\n/growth - Check your server's member growth\n/reminder - Set a custom reminder", ephemeral: true })
      }
    }
    if (!interaction.isChatInputCommand()) return;
    const command = client.commands.get(interaction.commandName);
    if (!command) {
      return interaction.reply({ content: "Unable to find given command!" });
    }

    if (command.developer && interaction.user.id !== ("642308656217456641" || "603543838681989141")) {
      return interaction.reply({
        content:
          "Command marked as developer only\n**__Common Reasons__**\n> Command let's users access sensitive data\n> Command is in beta / development\n> Command is private",
      });
    } else {


      command.execute(interaction, client);

    }
    talkedRecently.add(interaction.user.id);
    setTimeout(() => {
      // Removes the user from the set after a minute
      talkedRecently.delete(interaction.user.id);
    }, 5000);
  },
};
