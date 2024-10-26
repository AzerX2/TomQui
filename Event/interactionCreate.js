/**
 * 
 * @param {*} client 
 * @param {*} interaction 
 * @returns 
 * 
 * @description Cette fonction est appelée lorsque un utilisateur intéragit avec un bouton ou un menu déroulant.
 */
module.exports = async(client, interaction) => {
    if (interaction.isButton()) {
        let sing1 = guildMember.guild.roles.cache.get("1150764722015174787")
        let visiteur = guildMember.guild.roles.cache.get("1150764750641299556")
        if (interaction.customId === 'ing1') {
            await interaction.member.roles.add(sing1);
            await interaction.member.roles.remove(visiteur);
            await interaction.reply({ content: 'Vous avez bien été ajouté au rôle ing 1', ephemeral: true });
        } else if (interaction.customId === 'visiteur') {
            await interaction.member.roles.add(visiteur);
            await interaction.member.roles.remove(sing1);
            await interaction.reply({ content: 'Vous avez bien été ajouté au rôle visiteur', ephemeral: true });
        }
    }
    // si c'est une commande
    if (interaction.isCommand()) {
        const command = client.commands.get(interaction.commandName);
        if (!command) return;
        try {
            await command.execute(interaction);
        } catch (error) {
            if (error) console.error(error);
            await interaction.reply({
                content: 'There was an error while executing this command!',
                ephemeral: true
            });
        }
    }
};