const Discord = require('discord.js');
const { debug } = require('request-promise');

module.exports = {
    name: 'crab',
    async execute(interaction, Crabs) {
        var embed;

        const count = await Crabs.countDocuments();
        const index = await Math.floor(Math.random() * count);

        const crab = (await Crabs.find().limit(1).skip(index))[0];
        if(crab)
        {
            embed = new Discord.MessageEmbed()
                .setColor(0x30972D)
                .setTitle(crab.crab)
                .attachFiles([crab.image])
                .setImage(crab.image);
        }
        else
        {
            embed = new Discord.MessageEmbed()
                .setColor(0x30972D)
                .setTitle("No Crabs Error :(");
        }

        return [embed];
    }
}

