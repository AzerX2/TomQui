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
    if (message.content === 'tom qui ?' || message.content === 'Tom qui ?' || message.content === 'Tom Qui ?') {
        message.reply('Tom père !');
    }
};