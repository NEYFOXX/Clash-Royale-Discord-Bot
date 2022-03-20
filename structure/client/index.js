const fs = require('fs');
const Discord = require('discord.js');
const { Client } = require('discord.js');
const { Database, Table } = require('luma-db-v2');
const config = require("../../config");
const colors = require('colors');
global.print = console.log; 

class bot extends Client {
    constructor(options = {
        intents: [Discord.Intents.FLAGS.DIRECT_MESSAGE_REACTIONS, Discord.Intents.FLAGS.DIRECT_MESSAGES, Discord.Intents.FLAGS.DIRECT_MESSAGE_TYPING, Discord.Intents.FLAGS.GUILDS, Discord.Intents.FLAGS.GUILD_BANS, Discord.Intents.FLAGS.GUILD_EMOJIS_AND_STICKERS, Discord.Intents.FLAGS.GUILD_INTEGRATIONS, Discord.Intents.FLAGS.GUILD_INVITES, Discord.Intents.FLAGS.GUILD_MEMBERS, Discord.Intents.FLAGS.GUILD_MESSAGES, Discord.Intents.FLAGS.GUILD_MESSAGE_REACTIONS, Discord.Intents.FLAGS.GUILD_MESSAGE_TYPING, Discord.Intents.FLAGS.GUILD_PRESENCES, Discord.Intents.FLAGS.GUILD_SCHEDULED_EVENTS, Discord.Intents.FLAGS.GUILD_VOICE_STATES, Discord.Intents.FLAGS.GUILD_WEBHOOKS],
        partials: [
            'CHANNEL'
        ]
    }) {
        super(options);
        this.db = {
            profile: new Table("profile")

        };
        this.config = config; 
        this.myDb = new Database({
            name: this.config.database.name, 
            password: this.config.database.password, 
            tables: [this.db["profile"]]
        });
        this.commands = new Discord.Collection(); 
        this.events = new Discord.Collection();
        this.aliases = new Discord.Collection();
        this.initCommands(); 
        this.initEvents();
        this.login(config.bot.token); 
    }

    initCommands() {
        print(`[Handler] - Chargement des commandes...`.green);  
        const subFolders = fs.readdirSync('./commands')
        for (const category of subFolders) {
            const commandsFiles = fs.readdirSync(`./commands/${category}`).filter(file => file.endsWith('.js'))
            for (const commandFile of commandsFiles) {
                const command = require(`../../commands/${category}/${commandFile}`)
                this.commands.set(command.name, command)
                if (command.aliases && command.aliases.length > 0) {
                    command.aliases.forEach(alias => this.aliases.set(alias, command))
                }
            }
        }
    }

    initEvents() {
        const subFolders = fs.readdirSync(`./events`)
        for (const category of subFolders) {
            const eventsFiles = fs.readdirSync(`./events/${category}`).filter(file => file.endsWith(".js"))
            for (const eventFile of eventsFiles) {
                const event = require(`../../events/${category}/${eventFile}`)
                this.on(event.name, (...args) => event.run(this, ...args))
                this.events.set(event.name, event)
                if (category === 'anticrash') process.on(event.name, (...args) => event.run(this, ...args))
            }
        }
    }
}

exports.bot = bot