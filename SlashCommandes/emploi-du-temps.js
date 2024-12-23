const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageEmbed } = require('discord.js');
const dayjs = require('dayjs');
const utc = require('dayjs/plugin/utc');
const timezone = require('dayjs/plugin/timezone');
const ical = require('ical');

dayjs.extend(utc);
dayjs.extend(timezone);

let fetch;

(async () => {
    fetch = (await import('node-fetch')).default;
})();

module.exports = {
    data: new SlashCommandBuilder()
        .setName('emploi-du-temps')
        .setDescription('Récupère l\'emploi du temps pour une date donnée')
        .addStringOption(option =>
            option.setName('date')
                .setDescription('Date de l\'emploi du temps (format YYYY-MM-DD)')
                .setRequired(false)
        )
        .addStringOption(option =>
            option.setName('groupe')
                .setDescription('Groupe de l\'emploi du temps')
                .setRequired(false)
                ),
    async execute(interaction) {
        let url = 'https://zeus.ionis-it.com/api/group/434/ics/EeMUMBH1j7';
        const dateInput = interaction.options.getString('date');
        const targetDate = dateInput ? dayjs(dateInput) : dayjs().startOf('day');
        if (!targetDate.isValid()) {
            return interaction.reply('La date spécifiée est invalide. Utilisez le format YYYY-MM-DD.');
        }

        const groupe = interaction.options.getString('groupe');

        if (groupe) {
            if (groupe === "1") {
                url = 'https://zeus.ionis-it.com/api/group/410/ics/EeMUMBH1j7';
            } else if (groupe === "2") {
                url = 'https://zeus.ionis-it.com/api/group/411/ics/EeMUMBH1j7';
            } else if (groupe === "3") {
                url = 'https://zeus.ionis-it.com/api/group/412/ics/EeMUMBH1j7';
            } else {
                return interaction.reply('Groupe invalide. Veuillez spécifier un groupe entre 1 et 3.');
            }

        }


        try {
            const response = await fetch(url);
            const icsData = await response.text();
            const events = ical.parseICS(icsData);
            const eventsForDate = Object.values(events).filter(event => 
                event.start && dayjs(event.start).isSame(targetDate, 'day')
            );

            if (eventsForDate.length === 0) {
                return interaction.reply(`Aucun événement pour le ${targetDate.format('YYYY-MM-DD')}.`);
            }

            const embed = new MessageEmbed()
                .setTitle(`Emploi du temps pour le ${targetDate.format('YYYY-MM-DD')}`)
                .setColor('BLUE');

            eventsForDate.forEach(event => {
                const start = dayjs(event.start).tz('Europe/Paris').format('HH:mm');
                const end = dayjs(event.end).tz('Europe/Paris').format('HH:mm');
                embed.addFields({
                    name: event.summary || 'Événement',
                    value: event.description == "" ? `${start} - ${end} (${event.location || 'Lieu inconnu'})` : `${start} - ${end} (${event.location || 'Lieu inconnu'})\nDescription : ${event.description}`,
                    inline: false
                });
            });

            interaction.reply({ embeds: [embed] });
        } catch (error) {
            console.error(error);
            interaction.reply('Erreur lors de la récupération de l\'emploi du temps.');
        }
    }
};
