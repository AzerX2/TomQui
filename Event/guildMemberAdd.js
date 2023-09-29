/**
 * @param {*} client 
 * @param {*} guildMember 
 * 
 * @returns {void}
 * 
 * @description Cette fonction est appelée lorsque un membre rejoint un serveur.
 */
module.exports = async(client, guildMember) => {

    const channel = client.channels.cache.get("1150764608353751082");
    channel.send(`Bienvenue ${guildMember} sur le serveur du groupe 2 !`);

    // on lui ajout le rôle : 1150764750641299556 
    let role = guildMember.guild.roles.cache.get("1150764750641299556")
    try {
        guildMember.roles.add(role)
    } catch (error) {
        console.log(error)
    }
};