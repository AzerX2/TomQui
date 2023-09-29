/**
 * @param {Client} client
 * @returns {void}
 * 
 * @description Cette fonction est appelée lorsque le bot est prêt.
 */

const {
    Collection,
    MessageEmbed
} = require('discord.js');

// Si vous souhaitez mettre seulement sur un serveur de test, mettez l'id du serveur dans la variable TEST_GUILD_ID
let TEST_GUILD_ID = ""

let TOKEN = process.env.TOKEN
const {
    REST
} = require('@discordjs/rest');
const {
    Routes
} = require('discord-api-types/v9');
const fs = require('fs');

/**
 * idée :
 * rappel des sessions de travail 1 jour avant et si ce n'est pas recurrent il est delete de la bdd
 */

let session = require('../models/session.js');
// on va créé une fonction qui va check toutes les 24h si il y a des sessions à rappeler 

async function checkSession() {
    //si une session est dans moins de 24h on va la rappeler
    let date = new Date()
    let date24h = new Date(date.getTime() + 86400000)
    let sessions = await session.find({ date: { $lte: date24h } })
    console.log(sessions)
        // on va check si la session est recurrente ou non
        // si la session est passé et n'est pas recurrente on la delete de la bdd
    for (let i = 0; i < sessions.length; i++) {
        let sessionToCheck = sessions[i]
        if (sessionToCheck.recurrent == false) {
            if (sessionToCheck.date < date) {
                await sessionToCheck.deleteOne()
            }
        }
    }
    // on va rappeler les sessions
    for (let i = 0; i < sessions.length; i++) {
        let sessionToCheck = sessions[i]
            // on va récupérer le jour de la session et le jour actuel (de date24h)
        let daySession = sessionToCheck.date.getDate()
        let dayDate = date24h.getDate()
            // si les jours sont égaux on va rappeler la session
        if (daySession == dayDate) {
            // on envoie un embed de rappel dans : 1157395295475355718
            let channel = client.channels.cache.get("1157395295475355718")
            let sessionhours = sessionToCheck.date.getHours()
            let embed = new MessageEmbed()
                .setTitle("Rappel de session")
                .setDescription(`La session ${sessionToCheck.nom} est dans moins de 24h`)
                .addFields({ name: 'Date', value: sessionToCheck.date + " à " + sessionhours + "h", inline: true })
                .addFields({ name: 'Recurrent', value: sessionToCheck.recurrent, inline: true })
                .setTimestamp()
                .setColor("GREEN");
            let participant = ""
            for (let i = 0; i < sessionToCheck.userlist.length; i++) {
                let user = sessionToCheck.userlist[i]
                participant += `<@${user}> `
            }
            embed.addFields({ name: 'Participant', value: participant, inline: true })
            channel.send({ embeds: [embed] })
        }
    }


}

module.exports = async(client) => {
    console.log("Bot est prêt !");

    // toute les 24h on va check si il y a des sessions à rappeler
    setInterval(checkSession, 86400000)

    // Registering the commands in the client
    const CLIENT_ID = client.user.id;

    // Slash commands
    const commandFiles = fs.readdirSync('./SlashCommandes').filter(file => file.endsWith('.js'));
    const commands = [];
    client.commands = new Collection();

    for (const file of commandFiles) {
        const command = require(`../SlashCommandes/${file}`);
        commands.push(command.data.toJSON());
        client.commands.set(command.data.name, command);
    }
    const rest = new REST({
        version: '9'
    }).setToken(TOKEN);
    (async() => {
        try {
            if (!TEST_GUILD_ID) {
                await rest.put(
                    Routes.applicationCommands(CLIENT_ID), {
                        body: commands
                    },
                );
                console.log('Successfully registered application commands globally');
            } else {
                await rest.put(
                    Routes.applicationGuildCommands(CLIENT_ID, TEST_GUILD_ID), {
                        body: commands
                    },
                );
                console.log('Successfully registered application commands for development guild');
            }
        } catch (error) {
            if (error) console.error(error);
        }
    })();
};