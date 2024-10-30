let Discord = require('discord.js');

let difftomqui = [
    'tom père',
    'tom fils',
    'tom papa',
    'tom papy',
    'tom papi',
    'tom pipi',
    'tom tom',
    'tom padre',
    'tom daddy',
];

let diffAnne = [
    'hulaingus',
    'al',
];

module.exports = async(client, message) => {
    if (message.author.bot) return;
    if (message.channel.type === 'dm') return;
    if (message.content === 'ping') {
        message.reply('pong');
    }
    if (message.content === 'pong') {
        message.reply('ping');
    }
    if (message.content.replace(/\s/g, '').toLowerCase().includes('tomqui')) {
        message.reply(difftomqui[Math.floor(Math.random() * difftomqui.length)] + ' !');
    }
    if (message.content.replace(/\s/g, '').toLowerCase().includes('quitom')) {
        message.reply(difftomqui[Math.floor(Math.random() * difftomqui.length)] + ' !');
    }
    if (message.content.replace(/\s/g, '').toLowerCase().includes('anne')) {
        message.reply(diffAnne[Math.floor(Math.random() * difftomqui.length)] + ' !');
    }
    if (message.content.toLowerCase() === 'salut') {
        message.reply('Salut !');
    }
    if (message.content.toLowerCase() === 'bonjour') {
        message.reply('Bonjour !');
    }
    if (message.content.toLowerCase() === 'coucou') {
        message.reply('Coucou !');
    }
    if (message.content.toLowerCase() === 'cc') {
        message.reply('Cc !');
    }
    if (message.content.toLowerCase() === 'hello') {
        message.reply('Hello !');
    }
    if (message.content.toLowerCase() === 'yo') {
        message.reply('Yo !');
    }
    if (message.content.toLowerCase() === 't\'es là ?') {
        message.reply('Oui, je suis là !');
    }
    if (message.content.toLowerCase() === 'tu es con ?') {
        message.reply('Non, je suis un robot !');
    }
    if (message.content.toLowerCase() === 'tu es un bot ?') {
        message.reply('Oui, je suis un bot !');
    }
};