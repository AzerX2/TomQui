/**
 * 
 * @param {*} client 
 * @param {*} interaction 
 * @returns 
 * 
 * @description Cette fonction est appelée lorsque un utilisateur intéragit avec un bouton ou un menu déroulant.
 */
module.exports = async(client, interaction) => {

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