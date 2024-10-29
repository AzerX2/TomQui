/**
 * 
 * @param {*} client 
 * @param {*} interaction 
 * @returns 
 * 
 * @description Cette fonction est appelée lorsque un utilisateur intéragit avec un bouton ou un menu déroulant.
 */

const { MessageEmbed } = require('discord.js');
const fs = require('fs');
const path = require('path');
const { exec } = require('child_process');

module.exports = async(client, interaction) => {
    if (interaction.isModalSubmit()) {
        if (interaction.customId === 'clangFormatModal') {
            const code = interaction.fields.getTextInputValue('codeInput');
            const tempFilePath = path.join(__dirname, 'temp_program.c');
            fs.writeFileSync(tempFilePath, code);
            const clangFormatConfigPath = '../.clang-format';

            exec(`clang-format -style=file -assume-filename=${clangFormatConfigPath} ${tempFilePath}`, (error, stdout, stderr) => {
                fs.unlinkSync(tempFilePath);

                const embed = new MessageEmbed()
                    .setTitle('Résultat de clang-format')
                    .setColor(error ? 'RED' : 'GREEN');

                if (error) {
                    embed.setDescription('Erreur lors de l\'exécution de clang-format.')
                        .addField('Détails:', stderr || 'Aucun détail disponible');
                } else {
                    embed.setDescription('Code formaté avec succès :')
                        .addField('Code formaté:', `\`\`\`c\n${stdout}\n\`\`\``);
                }

                interaction.reply({ embeds: [embed] });
            });
        }
    }
    if (interaction.isButton()) {
        console.log(interaction.guild)
        console.log(interaction.member)
        let sing1 = interaction.guild.roles.cache.find(role => role.id === "1150764722015174787")
        let visiteur = interaction.guild.roles.cache.find(role => role.id === "1150764722015174786")
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