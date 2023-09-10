const {
    ChatInputCommandInteraction,
    SlashCommandBuilder,
    StringSelectMenuOptionBuilder,
    ActionRowBuilder,
    StringSelectMenuBuilder
} = require("discord.js");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("help")
        .setDescription("Displays the list of commands"),
    /**
     *
     * @param {ChatInputCommandInteraction} interaction
     * @param { } client
     */
    async execute(interaction, client) {
        await interaction.deferReply({ ephemeral: true })
        try {
            const select = new StringSelectMenuBuilder()
                .setCustomId('help')
                .setPlaceholder('No options selected :(')
                .addOptions(
                    new StringSelectMenuOptionBuilder()
                        .setLabel('config')
                        .setDescription('Server Config')
                        .setValue('config'),
                    new StringSelectMenuOptionBuilder()
                        .setLabel('auto moderation')
                        .setDescription('AutoModeration based commands')
                        .setValue('automoderation'),
                    new StringSelectMenuOptionBuilder()
                        .setLabel('misc')
                        .setDescription('General misc commands')
                        .setValue('misc'),
                )

            const row = new ActionRowBuilder()
                .addComponents(select);
            interaction.editReply({
                content: 'Please select an option',
                components: [row],
            });
        } catch (err) {
            console.log(err)
            return interaction.editReply({ content: "<a:butterfly:1149702682722967603> We have encountered an error." })
        }

    },
};
