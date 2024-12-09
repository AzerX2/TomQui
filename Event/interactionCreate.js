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

function checkNetiquette(messageText) {
    const errors = [];

    const messageParts = messageText.split('--\n');
    const bodyAndSignature = messageParts[0];
    const signature = messageParts.length > 1 ? messageParts[1].trim() : '';

    const lines = bodyAndSignature.split('\n');
    const title = lines[0];
    const body = lines.slice(1).join('\n').trim();

    const greetings = ['Good morning', 'Hello', 'Bonjour', 'Hi'];
    const farewells = ['Thanks', 'Regards', 'Have a nice day', 'Cordialement'];

    if (!greetings.some(greeting => messageText.includes(greeting))) {
        errors.push('Missing greeting at the beginning of the message');
    }

    if (!farewells.some(farewell => messageText.includes(farewell))) {
        errors.push('Missing closing gratitude/farewell');
    }

    const titleRegex = /^\[[A-Z0-9+_/-]{1,10}\]\[[A-Z0-9+_/-]{1,10}\]\s.+$/;
    if (!titleRegex.test(title)) {
        errors.push('Invalid title format. Must be [CONTEXT][PURPOSE] followed by a summary');
    }

    if (title.length > 80) {
        errors.push('Title exceeds 80 characters');
    }

    const signatureRegex = /^[A-Za-z]+ [A-Za-z]+\n[A-Za-z0-9 .-]+(\n"[^"]*")?\n?$/;
    if (!signatureRegex.test(signature)) {
        errors.push('Invalid signature format');
    }

    const paragraphs = body.split('\n\n');
    if (paragraphs.some(p => p.includes('\n'))) {
        errors.push('Paragraphs should not contain line breaks within them');
    }

    const boldCount = (body.match(/\*\*[^*]+\*\*/g) || [])
        .reduce((acc, bold) => acc + bold.length, 0);
    const totalCount = body.length;
    if (boldCount > totalCount * 0.2) {
        errors.push('Excessive bold formatting (>20% of characters)');
    }

    const emojiRegex = /[\u{1F600}-\u{1F6FF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}]/u;
    if (emojiRegex.test(body)) {
        errors.push('Emojis are not allowed');
    }

    const textEmojiRegex = /[;:][)(\]]/;
    if (textEmojiRegex.test(body)) {
        errors.push('Text emoticons are not allowed');
    }

    const bodyLines = body.split('\n');
    if (bodyLines.some(line => line.length > 80)) {
        errors.push('Lines should not exceed 80 characters');
    }

    return {
        isValid: errors.length === 0,
        errors: errors
    };
}

function checkPOSIXCompliance(code) {
    const errors = [];

    // Helper function to check naming conventions
    function checkNamingConventions(code) {
        const nameErrors = [];

        // Check variable and function names (lowercase with underscores)
        const invalidNameRegex = /[A-Z][a-zA-Z0-9]*|[a-zA-Z0-9]+[A-Z][a-zA-Z0-9]*/;
        const camelCaseMatches = code.match(invalidNameRegex) || [];
        camelCaseMatches.forEach(match => {
            nameErrors.push(`Non-POSIX naming: "${match}" should use snake_case`);
        });

        // Check for meaningful variable names
        const shortNameRegex = /\b[a-z]{1,2}\b/g;
        const shortNames = (code.match(shortNameRegex) || [])
            .filter(name => !['if', 'in', 'do', 'for', 'or'].includes(name));
        shortNames.forEach(name => {
            nameErrors.push(`Potentially unclear variable name: "${name}"`);
        });

        return nameErrors;
    }

    // Check for portable shebang
    function checkShebang(code) {
        const shebangErrors = [];
        const shebangRegex = /^#!/;
        if (shebangRegex.test(code)) {
            const portableShebang = /^#!\/(bin\/(sh|bash)|usr\/bin\/env\s+(sh|bash))/;
            if (!portableShebang.test(code.split('\n')[0])) {
                shebangErrors.push('Use portable shebang: #!/bin/sh or #!/usr/bin/env sh');
            }
        }
        return shebangErrors;
    }

    // Check for portable command usage
    function checkCommandPortability(code) {
        const commandErrors = [];

        // List of non-portable commands or constructs
        const nonPortableCommands = [
            /\bawk\s+'[^']*'/,           // Specific awk syntax
            /\bsed\s+-[A-Za-z]+/,        // Non-standard sed options
            /\bgrep\s+-[A-Za-z]+/,       // Non-standard grep options
            /\b(source|\.)\s+/,          // Non-POSIX shell sourcing
            /\[\[.*\]\]/,                // Bash-specific test construct
            /\b(echo\s+-[en])\b/,        // Non-portable echo options
        ];

        nonPortableCommands.forEach((regex, index) => {
            const matches = code.match(regex) || [];
            matches.forEach(match => {
                commandErrors.push(`Potentially non-portable command/construct: ${match}`);
            });
        });

        return commandErrors;
    }

    // Check for portable file operations
    function checkFileOperations(code) {
        const fileErrors = [];

        // Check for non-portable file test operators
        const nonPortableFileTests = [
            /\s-[portunxrwx]\s/,  // Non-standard file test operators
        ];

        nonPortableFileTests.forEach(regex => {
            const matches = code.match(regex) || [];
            matches.forEach(match => {
                fileErrors.push(`Potentially non-portable file test: ${match}`);
            });
        });

        return fileErrors;
    }

    // Collect all compliance checks
    const nameErrors = checkNamingConventions(code);
    const shebangErrors = checkShebang(code);
    const commandErrors = checkCommandPortability(code);
    const fileErrors = checkFileOperations(code);

    // Combine all errors
    errors.push(...nameErrors, ...shebangErrors, ...commandErrors, ...fileErrors);

    // Additional POSIX compliance checks
    if (code.includes('\r\n')) {
        errors.push('Use LF (\\n) line endings, not CRLF');
    }

    // Check for indentation (tabs vs spaces)
    if (/^\t/m.test(code)) {
        errors.push('Use spaces for indentation, not tabs');
    }

    return {
        isCompliant: errors.length === 0,
        errors: errors
    };
}

module.exports = async (client, interaction) => {
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
        if (interaction.customId === 'posixCompliantModal') {
            const code = interaction.fields.getTextInputValue('codeInput');

            const complianceResult = checkPOSIXCompliance(code);

            if (complianceResult.isCompliant) {
                await interaction.reply({
                    content: '✅ Your code is POSIX compliant!',
                    ephemeral: true
                });
            } else {
                await interaction.reply({
                    content: '❌ POSIX Compliance Violations:\n' +
                        complianceResult.errors.map(e => `• ${e}`).join('\n'),
                    ephemeral: true
                });
            }
        }
        if (interaction.customId === 'checkNetiquetteModal') {
            const messageText = interaction.fields.getTextInputValue('messInput');

            const validationResult = checkNetiquette(messageText);

            if (validationResult.isValid) {
                await interaction.reply({
                    content: '✅ Your message passes the netiquette guidelines!',
                    ephemeral: true
                });
            } else {
                await interaction.reply({
                    content: '❌ Netiquette Violations:\n' +
                        validationResult.errors.map(e => `• ${e}`).join('\n'),
                    ephemeral: true
                });
            }
        }
    }
    if (interaction.isButton()) {
        //get guild by id : 1150764607628128289
        // sing1 : 1150764722015174787
        // visiteur : 1150764750641299556
        let guild = interaction.client.guilds.cache.get("1150764607628128289");
        console.log(guild.members.cache)
        console.log(interaction.user.id)
        let member = await guild.members.fetch(interaction.user.id);
        console.log(member)
        let sing1 = await guild.roles.fetch("1150764722015174787")
        let visiteur = await guild.roles.fetch("1150764750641299556")
        if (interaction.customId === 'ing1') {
            await member.roles.add(sing1);
            await member.roles.remove(visiteur);
            await interaction.reply({ content: 'Vous avez bien été ajouté au rôle ing 1', ephemeral: true });
        } else if (interaction.customId === 'visiteur') {
            await member.roles.add(visiteur);
            await member.roles.remove(sing1);
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