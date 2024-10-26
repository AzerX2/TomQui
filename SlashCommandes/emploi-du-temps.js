const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageEmbed } = require('discord.js');
const fetch = require('node-fetch');
const ical = require('ical');
const dayjs = require('dayjs');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('emploi-du-temps')
        .setDescription('Récupère l\'emploi du temps du jour'),
    async execute(interaction) {
        const url = 'https://zeus.ionis-it.com/api/group/434/ics/EeMUMBH1j7';

        try {
            const response = await fetch(url);
            const icsData = await response.text();
            const events = ical.parseICS(icsData);
            const today = dayjs().startOf('day');
            const todayEvents = Object.values(events).filter(event => 
                event.start && dayjs(event.start).isSame(today, 'day')
            );

            if (todayEvents.length === 0) {
                return interaction.reply('Aucun événement pour aujourd\'hui.');
            }

            const embed = new MessageEmbed()
                .setTitle('Emploi du temps du jour')
                .setColor('BLUE');

            todayEvents.forEach(event => {
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
