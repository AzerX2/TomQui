const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageEmbed } = require('discord.js');
const { exec } = require('child_process');
const fs = require('fs');
const path = require('path');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('clang-format')
        .setDescription('Formatte le programme avec clang-format')
        .addStringOption(option => 
            option.setName('program')
                .setDescription('Code source à formater')
                .setRequired(true)
        ),
    async execute(interaction) {
        const program = interaction.options.getString('program');
        const tempFilePath = path.join(__dirname, 'temp_program.cpp');
        fs.writeFileSync(tempFilePath, program);
        const clangFormatConfigPath = '.clang-format';

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
                    .addField('Code formaté:', `\`\`\`cpp\n${stdout}\n\`\`\``);
            }

            interaction.reply({ embeds: [embed] });
        });
    }
};
