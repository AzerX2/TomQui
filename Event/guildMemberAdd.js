/**
 * @param {*} client 
 * @param {*} guildMember 
 * 
 * @returns {void}
 * 
 * @description Cette fonction est appelée lorsque un membre rejoint un serveur.
 */
let Discord = require('discord.js');

module.exports = async(client, guildMember) => {
    if (guildMember.guild.id != "1150764607628128289") return;
    const channel = client.channels.cache.get("1150764608353751082");
    channel.send(`Bienvenue ${guildMember} sur le serveur du serveur des ing 1 de lyon !`);

    try {
        // on va demander à la personne si elle est en ing 1 ou pas avec un bouton
        const row = new Discord.MessageActionRow()
            .addComponents(
                new Discord.MessageButton()
                    .setCustomId('ing1')
                    .setLabel('Ing 1')
                    .setStyle('PRIMARY'),
                new Discord.MessageButton()
                    .setCustomId('visiteur')
                    .setLabel('Visiteur')
                    .setStyle('PRIMARY'),
            );
        let embed = new Discord.MessageEmbed()
            .setColor('#0099ff')
            .setTitle('Bienvenue sur le serveur du groupe de l\'ing 1 à lyon!')
            .setDescription('Veuillez choisir votre rôle')
            .setTimestamp()
            .setFooter('Epita');
        
        guildMember.send({ embeds: [embed], components: [row], content: guildMember.guild.id });
    } catch (error) {
        console.log(error)
    }
};