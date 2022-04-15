///////////////////////////////////////////////////////////////////////////////
// Name: Escravo do submundo
// By: André Codato a.k.a. ChacalMoon
// Language: javascript
// Path: ./bot.js
// Wiki: https://andre-codato.gitbook.io/stonerjesus_bot/
///////////////////////////////////////////////////////////////////////////////
// Importing and initializing modules
///////////////////////////////////////////////////////////////////////////////
require("dotenv").config();
const fs = require("fs");

const Database = require("./config/Database");
const db = new Database();
db.connect();

const { Client, Intents, Collection } = require("discord.js");
const client = new Client({
    intents: [
        Intents.FLAGS.GUILDS,
        Intents.FLAGS.GUILD_MESSAGES,
        Intents.FLAGS.GUILD_MEMBERS
    ]
});

///////////////////////////////////////////////////////////////////////////////
// Registering commands
///////////////////////////////////////////////////////////////////////////////
const commandFiles = fs.readdirSync("./slashCommands").filter(file => file.endsWith(".js"));

const commands = [];

client.commands = new Collection();

for (const file of commandFiles) {
    const command = require(`./slashCommands/${file}`);
    commands.push(command.data.toJSON());
    client.commands.set(command.data.name, command);
}

///////////////////////////////////////////////////////////////////////////////
// Registering events
///////////////////////////////////////////////////////////////////////////////
const eventFiles = fs
    .readdirSync("./events")
    .filter(file => file.endsWith(".js"));

for (const file of eventFiles) {
    const event = require(`./events/${file}`);
    
    if (event.once) {
        client.once(event.name, (...args) => event.execute(...args, commands));
    } else {
        client.on(event.name, (...args) => event.execute(...args, commands));
    }
}

///////////////////////////////////////////////////////////////////////////////
// Discord bot API login
///////////////////////////////////////////////////////////////////////////////
client.login(process.env.TOKEN);