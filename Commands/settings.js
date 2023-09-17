const {
    ChatInputCommandInteraction,
    SlashCommandBuilder,
    PermissionFlagsBits,
    ChannelType,
} = require("discord.js");

const guildSettings = require("../Events/GuildSettings/guildSettings")


module.exports = {
    data: new SlashCommandBuilder()
        .setName("settings")
        .setDescription("Manage your server settings")
        .setDefaultMemberPermissions(PermissionFlagsBits.ManageGuild)
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
        })
        .addSubcommand((subcommand) => {
            return subcommand
                .setName("channel")
                .setDescription("Change the auto tips channel")
                .addChannelOption((string) => {
                    return string
                        .setName("channel")
                        .setDescription("channel for auto tips")
                        .addChannelTypes(ChannelType.GuildText)
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

            } else if (interaction.options.getSubcommand() === "channel") {
                const channelID = interaction.options.getChannel("channel");
                if (!channelID) return;

                await guildSettings.findOneAndUpdate({
                    guildID: interaction.guild.id
                }, {
                    TipsChannel: channelID.id
                })

                return interaction.editReply("Updated.")

            }

        } catch (err) {
            console.log(err)
            return interaction.editReply({ content: "<a:butterfly:1149702682722967603> We have encountered an error." })
        }
    },
};
