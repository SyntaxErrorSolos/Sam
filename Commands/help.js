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
        const select = new StringSelectMenuBuilder()
            .setPlaceholder('select an option')
            .addOptions(
                new StringSelectMenuOptionBuilder()
                    .setLabel('ai')
                    .setDescription('AI related commands')
                    .setValue('ai'),
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
    },
};
