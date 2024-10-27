const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageActionRow, Modal, TextInputComponent } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('clang-format')
        .setDescription('Formatte le programme avec clang-format'),
    async execute(interaction) {
        const codeInput = new TextInputComponent()
            .setCustomId('codeInput')
            .setLabel('Entrez le code à formater')
            .setStyle('PARAGRAPH')
            .setPlaceholder('Votre code ici...')
            .setRequired(true);

        const row = new MessageActionRow().addComponents(codeInput);

        const modal = new Modal()
            .setTitle('Clang Format')
            .setCustomId('clangFormatModal')
            .addComponents(row);

        await interaction.showModal(modal);
    }
};
