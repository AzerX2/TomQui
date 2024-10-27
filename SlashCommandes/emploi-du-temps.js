const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageEmbed } = require('discord.js');
const dayjs = require('dayjs');
const ical = require('ical');

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
        ),
    async execute(interaction) {
        const url = 'https://zeus.ionis-it.com/api/group/434/ics/EeMUMBH1j7';
        const dateInput = interaction.options.getString('date');
        const targetDate = dateInput ? dayjs(dateInput) : dayjs().startOf('day');

        if (!targetDate.isValid()) {
            return interaction.reply('La date spécifiée est invalide. Utilisez le format YYYY-MM-DD.');
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
                const start = dayjs(event.start).format('HH:mm');
                const end = dayjs(event.end).format('HH:mm');
                embed.addField(event.summary || 'Événement', `${start} - ${end}`, false);
            });

            interaction.reply({ embeds: [embed] });
        } catch (error) {
            console.error(error);
            interaction.reply('Erreur lors de la récupération de l\'emploi du temps.');
        }
    }
};
