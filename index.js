const Discord = require('discord.js');
const client = new Discord.Client();
client.commands = new Discord.Collection();
const commandFunctions = require('./CommandFunctions');
const populateCrabs = require('./populateCrabs');
const mongoose = require('mongoose');
require('dotenv').config()
var conn;

module.exports = { client }

const crabsSchema = new mongoose.Schema({
    crab: String,
    image: String,
});
var Crabs;

// Connects to MongoDB Atlas with mongoose and registers commands on connection with discord.
client.on('ready', async () => {
    console.log(`Logged in as ${client.user.tag}!`);

    const uri =  "mongodb+srv://" + process.env.ATLASUSER + ":" + process.env.ATLASPASS + "@g3-cluster.8tlri.mongodb.net/CRABER?retryWrites=true&w=majority";
    mongoose.connect(uri, {useNewUrlParser: true});
    conn = mongoose.connection;
    conn.on('error', console.error.bind(console, 'connection error:'));

    Crabs = mongoose.model('Craber', crabsSchema, 'CRABS');

    await Crabs.countDocuments({}, async (err, count) => {
        if(err) {
            console.log(err);
        } else {
            if(count == 0) {
                await populateCrabs(Crabs);
            }
        }
    });

    if(process.argv.slice(2)[0] === 'test') {
        commandFunctions.registerCommands(client, 'CommandJSONS', '216420597255634944');
    } else {
        commandFunctions.registerCommands(client, 'CommandJSONS');
    }

    commandFunctions.fetchCommands(client, 'Commands');

    client.guilds.cache.each(guild => guild.comma);
});

// On interaction execute the command and setup any interactive elements.
client.ws.on('INTERACTION_CREATE', async interaction => {
    conn.collection(interaction.guild_id);

    try {
        // Get response from appropriate interaction's execute command.
        const response = await client.commands.get(interaction.data.name).execute(interaction, Crabs);
        // Send response to discord.
        client.api.interactions(interaction.id, interaction.token).callback.post({data: {type: 4, data: {embeds: response}}});

        // If the interaction is interactive run the interaction function.
        if(client.commands.get(interaction.data.name).interactive) {
            client.commands.get(interaction.data.name).interaction(interaction, Favorites);
        }
    } catch (error) {
        console.error(error);
        client.api.interactions(interaction.id, interaction.token).callback.post({data: {type: 4, data: {flags:64, content: `There was an error trying to execute that command. Our apologies.\n${error}`}}});
    }
});

client.login(process.env.TOKEN);

process.on('SIGINT', async () => {
    console.log('Bot Shutdown');
    // await client.destroy();
    process.exit(1);
});
