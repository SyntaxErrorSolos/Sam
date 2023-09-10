const {
    ChatInputCommandInteraction,
    SlashCommandBuilder,
} = require("discord.js");

//imports
const guildAccount = require("../Events/Account/guildAccount");
const userAccount = require("../Events/Account/userAccount");
const guildJoinRate = require("../Events/GuildStats/guildJoinRate");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("growth")
        .setDescription("Check the servers growth"),
    /**
     *
     * @param {ChatInputCommandInteraction} interaction
     * @param { } client
     */
    async execute(interaction, client) {
        await interaction.deferReply({ ephemeral: true })
        try {
            const growthEnabled = await guildJoinRate.findOne({ guildID: interaction.guild.id })
            if (!growthEnabled) return interaction.editReply({ content: "Growth check is disabled." })
            else {
                const memberLeaveAmount = growthEnabled.Left
                const netGrowth = interaction.guild.memberCount - memberLeaveAmount;
                const calculateRate = (netGrowth / interaction.guild.memberCount) * 100;

                console.log(growthEnabled.Left)
                console.log(memberLeaveAmount)

                await guildAccount.findOneAndUpdate({
                    guildID: interaction.guild.id
                }, {
                    $inc: { Tokens: -10 }
                })

                await userAccount.findOneAndUpdate({
                    userID: interaction.user.id
                }, {
                    $inc: { Tokens: -5 }
                })

                return interaction.editReply({ content: `Your guild's **overall** growth rate is: ${Math.round(calculateRate * 100) / 100}%` })
            }

        } catch (err) {
            console.log(err)
            return interaction.editReply({ content: "<a:butterfly:1149702682722967603> We have encountered an error." })
        }
    },
};
