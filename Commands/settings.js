const {
    ChatInputCommandInteraction,
    SlashCommandBuilder,
    PermissionFlagsBits
} = require("discord.js");

const guildSettings = require("../Events/GuildSettings/guildSettings")


module.exports = {
    data: new SlashCommandBuilder()
        .setName("settings")
        .setDescription("Manage your server settings")
        .setDMPermission(PermissionFlagsBits.ManageGuild)
        .addSubcommand((subcommand) => {
            return subcommand
                .setName("description")
                .setDescription("Change the server description")
                .addStringOption((string) => {
                    return string
                        .setName("description")
                        .setDescription("the server description")
                        .setMinLength(10)
                        .setMaxLength(500)
                        .setRequired(true)
                })
        }),
    /**
     *
     * @param {ChatInputCommandInteraction} interaction
     * @param { } client
     */
    async execute(interaction, client) {
        await interaction.deferReply({ ephemeral: true })
        try {
            if (interaction.options.getSubcommand() === "description") {
                const desc = interaction.options.getString("description");
                if (!desc) return;

                await guildSettings.findOneAndUpdate({
                    guildID: interaction.guild.id
                }, {
                    Description: desc
                })

                return interaction.editReply("Updated.")

            }

        } catch (err) {
            console.log(err)
            return interaction.editReply({ content: "<a:butterfly:1149702682722967603> We have encountered an error." })
        }
    },
};
