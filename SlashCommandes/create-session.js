/**
 * @file create-session.js
 * @description Ce fichier sert à créer une session de travail.
 */

const { SlashCommandBuilder } = require('@discordjs/builders');

function randomNumber() {
    // renvoit un nombre aléatoire entre 0 et 255
    return Math.floor(Math.random() * 256);
}

module.exports = {
    data: new SlashCommandBuilder()
        .setName('create-session')
        .setDescription('permet de créé une session de travail')
        .addStringOption(option => option.setName('nom').setDescription('nom de la session (mettre matière)').setRequired(true))
        .addStringOption(option => option.setName('date').setDescription('date de la session forme : mois-jour-heure exemple : 9-10-12 : 10 septembre à 12h ').setRequired(true))
        .addBooleanOption(option => option.setName('recurrent').setDescription('si la session est recurrente').setRequired(true))
        .addStringOption(option => option.setName('description').setDescription('description de la session').setRequired(true)),
    async execute(interaction) {
        // si l'utilisateur n'a pas les permissions admin il ne peut pas utiliser la commande
        if (!interaction.member.permissions.has('ADMINISTRATOR')) return interaction.reply({ content: "Vous n'avez pas les permissions pour utiliser cette commande", ephemeral: true });

        let session = require('../models/session.js');

        let nom = interaction.options.getString('nom');
        let date = interaction.options.getString('date');
        let recurrent = interaction.options.getBoolean('recurrent');
        let description = interaction.options.getString('description');

        let year = "2024"
        let dateFormated = date.split("-")
        let month = dateFormated[0]
        let day = dateFormated[1]
        let hour = dateFormated[2]

        // pour month on va enlever 1 car le mois commence à 0 et non à 1
        console.log(month - 1)
        let dateFinal = new Date(year, month - 1, day, hour)

        let sessionToCreate = new session({
            nom: nom,
            date: dateFinal,
            recurrent: recurrent,
            userlist: [],
            id: randomNumber(),
            description: description

        })
        sessionToCreate.save().then(() => {
            interaction.reply({ content: "Session créé avec succès" })
        }).catch((err) => {
            console.log(err)
            interaction.reply({ content: "Une erreur est survenue lors de la création de la session" })
        })



    }
};