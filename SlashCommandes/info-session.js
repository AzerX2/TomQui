const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageEmbed } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('info-session')
        .setDescription('Affiche les informations de la session')
        .addStringOption(option => option.setName('id').setDescription('id de la session').setRequired(true)),
    async execute(interaction) {
        let id = interaction.options.getString('id');
        let session = require('../models/session.js');
        let sessionData = await session.findOne({ id: id });
        if (!sessionData) return interaction.reply({ content: "Cette session n'existe pas" });
        let embed = new MessageEmbed()
            .setTitle("Session")
            .setDescription(`Information de la session : ${sessionData.id}`)
            .addFields({ name: 'Nom', value: sessionData.nom, inline: true })
            .addFields({ name: 'Info', value: sessionData.description, inline: true })
            .addFields({ name: 'Date', value: sessionData.date, inline: true })
            .setTimestamp()
            .setColor(interaction.guild.me.displayHexColor);
        interaction.reply({ embeds: [embed] })
    }
};