const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageEmbed } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('demande-aide')
        .setDescription('Permet de faire une demande de session au délégué')
        .addStringOption(option => option.setName('matiere').setDescription('matière de la session').setRequired(true))
        .addStringOption(option => option.setName('info').setDescription('information complétementaire par exemple le chapitre ou la notion').setRequired(true)),
    async execute(interaction) {
        let matiere = interaction.options.getString('matiere');
        let info = interaction.options.getString('info');

        let embed = new MessageEmbed()
            .setTitle("Demande d'aide")
            .setDescription(`Demande d'aide de <@${interaction.user.id}>`)
            .addFields({ name: 'Matière', value: matiere, inline: true })
            .addFields({ name: 'Info', value: info, inline: true })
            .setTimestamp()
            .setColor(interaction.guild.me.displayHexColor);

        // on envoie au channel : 1157379492315136051
        let channel = interaction.guild.channels.cache.get("1157379492315136051")
        channel.send({ embeds: [embed] })
        interaction.reply({ content: "Votre demande d'aide a bien été envoyé au délégué" })
    }
};