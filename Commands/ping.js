const {
  ChatInputCommandInteraction,
  SlashCommandBuilder,
} = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("ping")
    .setDescription("Pong!"),
  /**
   *
   * @param {ChatInputCommandInteraction} interaction
   * @param { } client
   */
  async execute(interaction, client) {
    await interaction.deferReply({ ephemeral: true })
    interaction.editReply(`My ping is: **${client.ws.ping}**`)
  },
};
