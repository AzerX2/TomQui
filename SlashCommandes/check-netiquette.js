const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageEmbed } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('check-netiquette')
        .setDescription('Vérifie que le message respecte la netiquette')
        .addStringOption(option => 
            option.setName('message')
                .setDescription('Message à vérifier')
                .setRequired(true)
        ),
    async execute(interaction) {
        const messInput = new TextInputComponent()
            .setCustomId('messInput')
            .setLabel('Entrez le message à vérifié')
            .setStyle('PARAGRAPH')
            .setPlaceholder('Votre code ici...')
            .setRequired(true);

        const row = new MessageActionRow().addComponents(messInput);

        const modal = new Modal()
            .setTitle('Check Netiquette')
            .setCustomId('checkNetiquetteModal')
            .addComponents(row);

        await interaction.showModal(modal);
    }
};
