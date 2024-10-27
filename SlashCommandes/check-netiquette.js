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
        const message = interaction.options.getString('message');
        const issues = [];

        if (!/^(bonjour|salut|hello|hi|bonsoir)/i.test(message)) {
            issues.push("Le message devrait commencer par une salutation (e.g., Bonjour, Salut).");
        }

        if (!/(merci|cordialement|bonne journée|à bientôt)$/i.test(message)) {
            issues.push("Le message devrait se terminer par une formule de politesse (e.g., Merci, Cordialement).");
        }

        if (message.length > 800) {
            issues.push("Le message est trop long. Essayez de le rendre plus concis.");
        }

        if (/(\*\*.*?\*\*){3,}/.test(message)) {
            issues.push("Évitez d'utiliser trop de texte en gras.");
        }

        if (/[^\w\s]/.test(message)) {
            issues.push("Les emojis et symboles spéciaux ne sont pas autorisés.");
        }

        if (issues.length === 0) {
            return interaction.reply('Le message respecte la netiquette.');
        }

        const embed = new MessageEmbed()
            .setTitle('Vérification de la Netiquette')
            .setDescription('Votre message comporte quelques problèmes :')
            .setColor('RED');

        issues.forEach((issue, index) => {
            embed.addField(`Problème ${index + 1}`, issue);
        });

        interaction.reply({ embeds: [embed] });
    }
};
