const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageEmbed } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('session-list')
        .setDescription('Affiche la liste des sessions'),
    async execute(interaction) {
        let session = require('../models/session.js');
        let sessionData = await session.find();

        let embed = new MessageEmbed()
            .setTitle("Session")
            .setDescription(`Liste des sessions`)
            .setTimestamp()
            .setColor(interaction.guild.me.displayHexColor);

        sessionData.forEach(element => {
            embed.addFields({ name: 'Nom ' + element.nom, value: 'Id ' + element.id, inline: true })
        })

        interaction.reply({ embeds: [embed] })

    }
};