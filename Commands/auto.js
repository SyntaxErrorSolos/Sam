const {
    ChatInputCommandInteraction,
    SlashCommandBuilder,
    PermissionFlagsBits
} = require("discord.js");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("auto")
        .setDescription("Manage guild automations")
        .setDefaultMemberPermissions(PermissionFlagsBits.ManageGuild)
        .addSubcommand((subcommand) => {
            return subcommand
                .setName("tips")
                .setDescription("get helpful tips based on server activity")
        }),
    /**
     *
     * @param {ChatInputCommandInteraction} interaction
     * @param { } client
     */
    async execute(interaction, client) {
        await interaction.deferReply({ ephemeral: true })

        try {
            if(interaction.options.getSubcommand() === "tips") {
                
            }
        } catch (err) {
            console.log(err)
            return interaction.editReply({ content: "<a:butterfly:1149702682722967603> We have encountered an error." })
        }
    },
};
F  