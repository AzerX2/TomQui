let Discord = require('discord.js');


module.exports = async(client, message) => {
    if (message.author.bot) return;
    if (message.channel.type === 'dm') return;
    if (message.content === 'ping') {
        message.reply('pong');
    }
    if (message.content === 'pong') {
        message.reply('ping');
    }
    if (message.content.toLowerCase() === 'tom qui ?') {
        message.reply('Tom père !');
    }
    if (message.content.toLowerCase() === 'salut') {
        message.reply('Salut !');
    }
    if (message.content.toLowerCase() === 'bonjour') {
        message.reply('Bonjour !');
    }
    
};