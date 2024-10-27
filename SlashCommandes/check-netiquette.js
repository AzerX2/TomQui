const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageEmbed } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('check-netiquette')
        .setDescription('vérifie que le message respecte la netiquette')
        .addStringOption(option => 
            option.setName('message')
                .setDescription('message à vérifier')
                .setRequired(true)
        ),
    async execute(interaction) {
        return interaction.reply('Commande en cours de développement');
    }
};
