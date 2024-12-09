const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageEmbed } = require('discord.js');
const { exec } = require('child_process');
const fs = require('fs');
const path = require('path');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('posix-compliant')
        .setDescription('Vérifie si le programme est POSIX-compliant'),
    async execute(interaction) {
        const codeInput = new TextInputComponent()
            .setCustomId('codeInput')
            .setLabel('Entrez le code à vérifier')
            .setStyle('PARAGRAPH')
            .setPlaceholder('Votre code ici...')
            .setRequired(true);

        const row = new MessageActionRow().addComponents(codeInput);

        const modal = new Modal()
            .setTitle('POSIX Compliant')
            .setCustomId('posixCompliantModal')
            .addComponents(row);

        await interaction.showModal(modal);
    }
};
