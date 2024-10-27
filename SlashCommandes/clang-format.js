const { SlashCommandBuilder, Modal, TextInputComponent, showModal } = require('@discordjs/builders');
const { MessageActionRow } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('clang-format')
        .setDescription('Formatte le programme avec clang-format'),
    async execute(interaction) {
        const modal = new Modal()
            .setCustomId('clangFormatModal')
            .setTitle('Clang Format');

        const codeInput = new TextInputComponent()
            .setCustomId('codeInput')
            .setLabel('Entrez le code à formater')
            .setStyle('PARAGRAPH')
            .setPlaceholder('Votre code ici...')
            .setRequired(true);

        const firstActionRow = new MessageActionRow().addComponents(codeInput);
        modal.addComponents(firstActionRow);

        await interaction.showModal(modal);
    }
};
