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

//definitions
const prefix = "!"

//mongoose
const { connect, default: mongoose } = require("mongoose");
connect(client.config.DatabaseURL, {}).then(() =>
    console.log("Connected to MongoDB")
);

//models
const guildAccount = require("./Events/Account/guildAccount.js");
const guildMemberJoinRate = require("./Events/GuildStats/guildJoinRate.js");

//message events
client.on("messageCreate", async (message) => {
    if (!message.guild) return;
    if (message.author.bot) return;

    const args = message.content.slice(prefix.length).split(/ +/);
    const command = args.shift().toLowerCase();

    if (command === "approve") {

        try {



            if (!message.guild.id === "802200297710944283") return;
            if (message.member.roles.cache.has("802569211816968234") === true) {
                const m = args[0]
                if (!m) return;
                const findGuild = await guildAccount.findOne({ GuildID: m })
                if (findGuild) return;
                else {
                    await guildAccount.create({
                        guildID: m,
                        Tokens: 100
                    })
                    return await message.reply("Guild has been approved.")
                }
            } else {
                return message.reply("Must be a manager or higher")
            }
        } catch (err) {
            console.log(err)
            return message.reply({ content: "<a:butterfly:1149702682722967603> We have encountered an error." })
        }
    }
})



//logging into the client
client.login(client.config.TOKEN); //Get token from the configjson file!
