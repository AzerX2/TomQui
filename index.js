/**
 * Template Créé par Azer_X2#8235
 * github: https://github.com/AzerX2
 * créditez moi si vous utilisez ce template
 */

const {
    Client,
    Collection,
    Intents,
    MessageEmbed,
    Permissions
} = require('discord.js');
// On crée un nouveau client Discord avec les intents souhaités
const client = new Client({
    intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES, Intents.FLAGS.GUILD_MEMBERS, Intents.FLAGS.GUILD_MESSAGE_REACTIONS]
});

// On récupère le préfixe du bot et le token et le lien de la base de données
require('dotenv').config();

// MongoDB
const mongoose = require('mongoose');

mongoose.connect(process.env.MONGO_URL, { useNewUrlParser: true, useUnifiedTopology: true }).then(console.log('Connectée à Mongodb.'));
const fs = require('fs');

// Gestion d'erreur
process.on('unhandledRejection', error => {
    console.error('Unhandled promise rejection:', error);
});

// handler d'events
fs.readdir("./Event/", (error, f) => {
    if (error) console.log(error);
    console.log(`${f.length} events charg�s`);

    f.forEach((f) => {
        const events = require(`./Event/${f}`);
        const event = f.split(".")[0];

        client.on(event, events.bind(null, client));
    });
});


// login du bot
client.login(process.env.TOKEN);