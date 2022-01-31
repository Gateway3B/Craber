const {MessageEmbed} = require('discord.js');
const axios = require('axios');
const {PrimaryColor} = require('../../config.json')

module.exports = {
    name: 'crabcascade',
    async execute(interaction, Crabs) {

        interaction.deferReply();

        const count = await Crabs.countDocuments();

        let failed = false;

        const embeds = [];
        const files = [];
        const awaits = [];
        for(let i = 0; i < 10; i++) {
            const index = await Math.floor(Math.random() * count);

            const crab = (await Crabs.find().limit(1).skip(index))[0];
            if(crab)
            {
                awaits.push(getImages(crab, embeds, files));
            }
            else
            {
                const embed = new MessageEmbed()
                    .setColor(PrimaryColor)
                    .setTitle("No Crabs Error :(");
    
                interaction.editReply({ embeds: [embed], ephermeral: true});
                failed = true;
                break;
            }
        }

        if(!failed) {
            await Promise.all(awaits);
            interaction.editReply({ embeds: embeds, files: files });
        }
    }
}

async function getImages(crab, embeds, files) {
    const response = await axios.get(crab.image, { responseType: 'arraybuffer' });
    const buffer = Buffer.from(response.data, "utf-8")

    crab.crab = crab.crab.replace(/ ([a-z])/g, function (x) {return x.toUpperCase()});

    const embed = new MessageEmbed()
        .setColor(PrimaryColor)
        .setTitle(crab.crab)
        .setImage(`attachment://${crab.crab.replace(' ', '_').replace('.', '')}.jpg`);

    embeds.push(embed);

    files.push({attachment: buffer, name: `${crab.crab.replace('.', '')}.jpg`});
}
