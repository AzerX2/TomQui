const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageEmbed } = require('discord.js');
const { exec } = require('child_process');
const fs = require('fs');
const path = require('path');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('posix-compliant')
        .setDescription('Vérifie si le programme est POSIX-compliant')
        .addStringOption(option => 
            option.setName('program')
                .setDescription('Programme à vérifier')
                .setRequired(true)
        ),
    async execute(interaction) {
        const program = interaction.options.getString('program');

        const tempFilePath = path.join(__dirname, 'temp_program.sh');
        fs.writeFileSync(tempFilePath, program);

        exec(`checkbashisms ${tempFilePath}`, (error, stdout, stderr) => {
            fs.unlinkSync(tempFilePath);

            const embed = new MessageEmbed()
                .setTitle('Vérification POSIX')
                .setColor(error ? 'RED' : 'GREEN');

            if (error) {
                embed.setDescription('Le programme n\'est pas POSIX-compliant.')
                    .addField('Détails:', stdout || stderr || 'Aucun détail disponible');
            } else {
                embed.setDescription('Le programme est POSIX-compliant.');
            }

            interaction.reply({ embeds: [embed] });
        });
    }
};
