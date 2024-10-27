// Description: Commande qui donne la liste des commandes disponibles
const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageEmbed } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('help')
        .setDescription('Donne la liste des commandes disponibles'),
    async execute(interaction) {
        // va récupérer les commandes du client et les afficher avec leur description

        let commands = interaction.client.commands;

        let embed = new MessageEmbed()
            .setTitle("Liste des commandes")
            .setDescription("Voici la liste des commandes disponibles")
            .setColor(interaction.guild.me.displayHexColor);

        commands.forEach(command => {
            embed.addFields({
                name: command.data.name,
                value: command.data.description,
                inline: true
            })
        }
        )

        interaction.reply({ embeds: [embed] })
    }
};