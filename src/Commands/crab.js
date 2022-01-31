const {MessageEmbed} = require('discord.js');
const axios = require('axios');
const {PrimaryColor} = require('../../config.json')

module.exports = {
    name: 'crab',
    async execute(interaction, Crabs) {
        const count = await Crabs.countDocuments();
        const index = await Math.floor(Math.random() * count);

        const crab = (await Crabs.find().limit(1).skip(index))[0];
        if(crab)
        {
            const response = await axios.get(crab.image, { responseType: 'arraybuffer' });
            const buffer = Buffer.from(response.data, "utf-8")

            crab.crab = crab.crab.replace(/ ([a-z])/g, function (x) {return x.toUpperCase()});

            const embed = new MessageEmbed()
                .setColor(PrimaryColor)
                .setTitle(crab.crab)
                .setImage(`attachment://${crab.crab.replace(' ', '_').replace('.', '')}.jpg`);

            interaction.reply({ embeds: [embed], files: [{attachment: buffer, name: `${crab.crab.replace('.', '')}.jpg`}]});
        }
        else
        {
            const embed = new MessageEmbed()
                .setColor(PrimaryColor)
                .setTitle("No Crabs Error :(");

            interaction.reply({ embeds: [embed], ephermeral: true});
        }
    }
}

