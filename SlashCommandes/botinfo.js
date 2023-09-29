/**
 * @file botinfo.js
 * @description Ce fichier sert à afficher les informations du bot.
 */

const { MessageEmbed } = require('discord.js');
const { SlashCommandBuilder } = require('@discordjs/builders');
const { oneLine, stripIndent } = require('common-tags');
const moment = require('moment');

module.exports = {

    data: new SlashCommandBuilder()
        .setName('botinfo')
        .setDescription('Affiche les informations du bot'),

    async execute(interaction) {
        const tech = stripIndent `
      Version     :: 1.0
      Librairie     :: Discord.js 
      Environement :: Node.js v14
      BDD    :: MongoDB
    `;
        const d = moment.duration(interaction.client.uptime);
        const days = (d.days() == 1) ? `${d.days()} jour` : `${d.days()} jours`;
        const hours = (d.hours() == 1) ? `${d.hours()} heure` : `${d.hours()} heures`;
        const minutes = (d.minutes() == 1) ? `${d.minutes()} minute` : `${d.minutes()} minutes`;
        const seconds = (d.seconds() == 1) ? `${d.seconds()} seconde` : `${d.seconds()} secondes`;
        const date = moment().subtract(d, 'ms').format('dddd, MMMM Do YYYY');
        const embed = new MessageEmbed()
            .setTitle('Infos du Bot')
            .setDescription(oneLine `
        Voici quelques informations sur moi !
      `)
            .addFields({ name: 'Client ID', value: `\`${interaction.client.user.id}\``, inline: true })
            .addFields({ name: 'Tech', value: `\`\`\`asciidoc\n${tech}\`\`\``, inline: true })
            .addFields({ name: 'Uptime', value: `\`\`\`prolog\n${days}, ${hours}, ${minutes}, and ${seconds}\`\`\``, inline: true })
            .addFields({ name: 'Ram', value: `\`\`\`prolog\n${(process.memoryUsage().heapUsed / 1024 / 1024).toFixed(2)} MB\`\`\``, inline: true })
            .setFooter({
                text: interaction.member.displayName,
                iconURL: interaction.user.displayAvatarURL({
                    dynamic: true
                })
            })
            .setTimestamp()
            .setColor(interaction.guild.me.displayHexColor);

        interaction.reply({ embeds: [embed] });
    }
}