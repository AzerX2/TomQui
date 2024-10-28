const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageEmbed } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('editeur')
        .setDescription('Demande à être éditeur')
        .addStringOption(option =>
            option.setName('nom')
                .setDescription('Votre nom')
                .setRequired(true)
        )
        .addStringOption(option =>
            option.setName('prenom')
                .setDescription('Votre prénom')
                .setRequired(true)
        )
        .addStringOption(option =>
            option.setName('mail')
                .setDescription('Votre adresse mail pour vous ajouter au editeurs')
                .setRequired(true))
        .addStringOption(option =>
            option.setName('matiere')
                .setDescription('Votr matière de prédilection')
                .setRequired(false)
        ),
    async execute(interaction) {
        const nom = interaction.options.getString('nom');
        const prenom = interaction.options.getString('prenom');
        const matiere = interaction.options.getString('matiere');
        const mail = interaction.options.getString('mail');

        // on envoie les informations à un channel pour qu'un admin puisse les vérifier : 1300573550394212352
        const embed = new MessageEmbed()
            .setTitle('Demande d\'édition')
            .setDescription(`Demande d'édition de ${nom} ${prenom}`)
            .addFields(
                { name: 'Nom', value: nom },
                { name: 'Prénom', value: prenom },
                { name: 'Matière', value: matiere || 'Non spécifié' },
                { name: 'Mail', value: mail }
            )
            .setColor(interaction.guild.me.displayHexColor);
        
        await interaction.client.channels.cache.get('1300573550394212352').send({ embeds: [embed] });
    
        const embed2 = new MessageEmbed()
            .setTitle('Demande envoyée')
            .setDescription('Votre demande a bien été envoyée. Un administrateur va la traiter dans les plus brefs délais.')
            .setColor(interaction.guild.me.displayHexColor)
            .setFooter('Merci de votre demande')
            .setTimestamp();


        interaction.reply({ embeds: [embed2] });
    }
};