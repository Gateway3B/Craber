const { Client, Intents, Collection} = require('discord.js');
const client = new Client({ intents: [Intents.FLAGS.GUILDS] });
client.commands = new Collection();

const { discordBotToken, ATLASUSER, ATLASPASS } = require('../config.json');
const commandFunctions = require('./Helpers/CommandFunctions');
const populateCrabs = require('./Helpers/populateCrabs');

const mongoose = require('mongoose');
var conn;
const crabsSchema = new mongoose.Schema({
    crab: String,
    image: String
});
var Crabs;

// Connects to MongoDB Atlas with mongoose and registers commands on connection with discord.
client.on('ready', async () => {
    console.log(`Logged in as ${client.user.tag}!`);

    const uri = `mongodb+srv://${ATLASUSER}:${ATLASPASS}@g3-cluster.8tlri.mongodb.net/CRABER?retryWrites=true&w=majority`;
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

    commandFunctions.fetchCommands(client, 'Commands');
});

// On interaction execute the command and setup any interactive elements.
client.on('interactionCreate', async interaction => {
    
    // Guards
    if(!interaction.isCommand()) return;
    if(!client.commands.has(interaction.commandName)) return;

    // Try executing command
    try {
        await client.commands.get(interaction.commandName).execute(interaction, Crabs);
    } catch(err) {
        console.error(err);
        await interaction.reply({ content: 'There was an error while executing this command!', ephemeral: true });
    }
});

client.login(discordBotToken);

process.on('SIGINT', async () => {
    console.log('Bot Shutdown');
    await client.destroy();
    process.exit(1);
});
