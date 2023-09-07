//djs
const {
    Client,
    GatewayIntentBits,
    Partials,
    Collection,
} = require("discord.js");
const {
    Guilds,
    GuildMessages,
    GuildMessageReactions,
    MessageContent,
} = GatewayIntentBits;
const { User, GuildMember, ThreadMember, Reaction, Message } = Partials;
const client = new Client({
    intents: [
        Guilds,
        GuildMessages,
        GuildMessageReactions,
        MessageContent,
    ],
    partials: [User, GuildMember, ThreadMember, Reaction, Message],
    allowedMentions: { parse: ["users"] },
});


const { loadEvents } = require("./Handlers/eventHandler.js");


//loading events
client.config = require("./config.json");
client.events = new Collection();
client.commands = new Collection();
loadEvents(client)

//mongoose
const { connect, default: mongoose } = require("mongoose");
connect(client.config.DatabaseURL, {}).then(() =>
    console.log("Connected to MongoDB")
);

//logging into the client
client.login(client.config.TOKEN); //Get token from the configjson file!
