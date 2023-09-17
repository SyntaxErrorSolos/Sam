// djs
import { Client, GatewayIntentBits, Partials, Collection } from 'discord.js';

const {
    Guilds,
    GuildMessages,
    GuildMessageReactions,
    MessageContent,
    GuildMembers
} = GatewayIntentBits;
const { User, GuildMember, ThreadMember, Reaction, Message } = Partials;

const client = new Client({
    intents: [
        Guilds,
        GuildMessages,
        GuildMessageReactions,
        MessageContent,
        GuildMembers
    ],
    partials: [User, GuildMember, ThreadMember, Reaction, Message],
    allowedMentions: { parse: ['users'] },
});

// loading events
import clientConfig from './config.json' assert { type: 'json' };
client.config = clientConfig;
client.events = new Collection();
client.commands = new Collection();
import { loadEvents } from './Handlers/eventHandler.js';
loadEvents(client);

// definitions
const prefix = '!';

// mongoose
import { connect, default as mongoose } from 'mongoose';

connect(client.config.DatabaseURL, {}).then(() => console.log('Connected to MongoDB'));

// models
import guildSettings from './Events/GuildSettings/guildSettings.js';
import guildAccount from './Events/Account/guildAccount.js';
import guildMemberJoinRate from './Events/GuildStats/guildJoinRate.js';

// guild join event
client.on('guildMemberAdd', async (member) => {
    try {
        if (member.user.bot) return;
        await guildMemberJoinRate.findOneAndUpdate({
            guildID: member.guild.id,
        }, {
            $inc: { JoinedWeekly: 1 },
        });
    } catch (err) {
        return console.log(err);
    }
});

// guild leave event
client.on('guildMemberUpdate', async (member) => {
    try {
        if (member.user.bot) return;
        await guildMemberJoinRate.findOneAndUpdate({
            guildID: member.guild.id,
        }, {
            $inc: { Left: 1 },
            $inc: { LeftWeekly: 1 },
        });
    } catch (err) {
        console.log(err);
    }
});

const guildID = [];
const numberOfMessage = [];

// openai
import OpenAI from 'openai';
const openai = new OpenAI({
    apiKey: client.config.OPENAI,
});

// cronjob for auto-tip
import cron from 'node-cron';
const job = cron.schedule('0 0 * * 0', async () => {
    try {
        for await (const guild of client.guilds.cache.values()) {
            const findGuild = await guildMemberJoinRate.findOne({ guildID: guild.id });
            const findChannel = await guildSettings.findOne({ guildID: guild.id });
            if (findGuild) {
                const channel = guild.channels.cache.get(findChannel.TipsChannel);
                // channels array
                const channelsArray = [];
                guild.channels.cache.forEach((channel) => {
                    channelsArray.push(channel.name);
                });
                // openai prompt
                const tip = await openai.chat.completions.create({
                    messages: [{ role: 'user', content: `Hello, I am an admin on a Discord server called ${guild.name}. The server's description is: ${findChannel.Description}. The server has the following channels: ${channelsArray}. The server got ${guildMemberJoinRate.JoinedWeekly} members last week and ${guildMemberJoinRate.LeftWeekly} members left the server. Based on the server description, server channels and the join and leave information provided, Please generate some helpful tips on how this server can grow!` }],
                    model: 'gpt-3.5-turbo',
                });

                channel.send(tip.choices[0].message);
                // clearing the memberjoinrate
                await guildMemberJoinRate.findOneAndUpdate({
                    guildID: guild.id,
                }, {
                    JoinedWeekly: 0,
                    LeftWeekly: 0,
                });
            }
        }
    } catch (err) {
        console.log(err);
    }
});

job.start();




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
                        Tokens: 300
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
