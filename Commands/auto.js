const {
    ChatInputCommandInteraction,
    SlashCommandBuilder,
    PermissionFlagsBits,
    ButtonBuilder,
    ButtonStyle,
    ActionRowBuilder,
    InteractionResponse
} = require("discord.js");

//imports
const guildJoinRate = require("../Events/GuildStats/guildJoinRate");
const guildMessageRate = require("../Events/GuildStats/guildMessageRate")
const guildSettings = require("../Events/GuildSettings/guildSettings");

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

        const enable = new ButtonBuilder()
            .setCustomId('enable')
            .setLabel('Enable')
            .setStyle(ButtonStyle.Success);

        const disable = new ButtonBuilder()
            .setCustomId('disable')
            .setLabel('Disable')
            .setStyle(ButtonStyle.Danger);

        const buttons = new ActionRowBuilder()
            .addComponents(enable, disable);


        const reply = await interaction.deferReply({ ephemeral: true })

        try {
            if (interaction.options.getSubcommand() === "tips") {
                interaction.editReply({ content: "Hello, Please select an option!", components: [buttons] })


                //filter collection
                const collectorFilter = i => i.user.id === interaction.user.id;
                const confirmation = await reply.awaitMessageComponent({ filter: collectorFilter, time: 60_000 });

                if (confirmation.customId === 'enable') {
                    const findGuild = await guildJoinRate.findOne({ guildID: interaction.guild.id })
                    const findGuild2 = await guildMessageRate.findOne({ guildID: interaction.guild.id })
                    if (findGuild2) return interaction.editReply({ content: "Auto growth is already enabled." })
                    if (findGuild) return interaction.editReply({ content: "Auto Growth is already enabled", components: [] })
                    else {
                        guildJoinRate.create({
                            guildID: interaction.guild.id,
                            Left: 0,
                            JoinedWeekly: 0,
                            LeftWeekly: 0,
                            PreviousWeek: 0,
                        })
                        guildMessageRate.create({
                            guildID: interaction.guild.id,
                            TotalMessages: 0,
                            PreviousWeek: 0
                        })
                        guildSettings.create({
                            guildID: interaction.guild.id,
                            Description: "A fun server.",
                            TipsChannel: interaction.channel.id
                        })
                        return interaction.editReply({ content: "Enabled. If you wish to see the current settings or configure them, Please run /settings.\n:warning: Tips channel has been bound to the current channel! Please run /settings channel to change it!", components: [] })
                    }
                } else if (confirmation.customId === 'disable') {
                    await guildJoinRate.findOneAndDelete({ guildID: interaction.guild.id })
                    await guildMessageRate.findOneAndDelete({ guildID: interaction.guild.id })
                    return interaction.editReply({ content: "Welp, Sad to see you go!", components: [] })
                }
            }
        } catch (err) {
            console.log(err)
            return interaction.editReply({ content: "<a:butterfly:1149702682722967603> We have encountered an error." })
        }
    },
};
