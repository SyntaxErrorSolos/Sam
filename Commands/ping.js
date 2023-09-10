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
    try {
      interaction.editReply(`My ping is: **${client.ws.ping}**`)
    } catch (err) {
      console.log(err)
      return interaction.editReply({ content: "<a:butterfly:1149702682722967603> We have encountered an error." })
    }
  },
};
