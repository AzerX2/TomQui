const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageEmbed } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('issue')
        .setDescription('Permet de faire une remonté de problème aux délégués cela peut être un problème de cours ou personnel')
        .addStringOption(option => option.setName('issue').setDescription('problème rencontré').setRequired(true)),
    async execute(interaction) {
        let issue = interaction.options.getString('issue');

        let embed = new MessageEmbed()
            .setTitle("Problème remonté")
            .setDescription(`Problème remonté par <@${interaction.user.id}>`)
            .addFields({ name: 'Problème', value: issue, inline: true })
            .setTimestamp()
            .setColor(interaction.guild.me.displayHexColor);

        // on envoie au channel : 1299797445731160136
        let channel = interaction.guild.channels.cache.get("1299797445731160136")
        channel.send({ embeds: [embed] })
        interaction.reply({ content: "Votre problème a bien été envoyé aux délégués" })
    }
};