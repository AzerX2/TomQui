const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageEmbed } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('join-session')
        .setDescription('Permet de rejoindre une session')
        .addStringOption(option => option.setName('id').setDescription('id de la session').setRequired(true)),
    async execute(interaction) {
        let id = interaction.options.getString('id');
        let session = require('../models/session.js');
        let sessionData = await session.findOne({ id: id });
        if (!sessionData) return interaction.reply({ content: "Cette session n'existe pas" });

        let userlist = sessionData.userlist;
        userlist.push(interaction.user.id);

        sessionData.userlist = userlist;
        sessionData.save();

        let embed = new MessageEmbed()
            .setTitle("Session")
            .setDescription(`✅ - Vous avez bien rejoint la session : ${sessionData.id}`)
            .setTimestamp()
            .setColor(interaction.guild.me.displayHexColor);

        interaction.reply({ embeds: [embed] })
    }
};