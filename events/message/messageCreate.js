module.exports = {
    name : 'messageCreate',
    run: async(client, message) => {
        if (!message) return;
        if (!message.author) return;
        if(message.author.bot) return;
        let prefix = client.config.bot.prefix
            
        if (message.content === `<@${client.user.id}>` || message.content === `<@!${client.user.id}>`) return message.reply(`Mon prefix est \`${prefix}\``).catch(e => { })
        if (!message.content.startsWith(prefix) || message.content === prefix || message.content.startsWith(prefix + ' ')) prefix = `<@${client.user.id}>`
        if (!message.content.startsWith(prefix) || message.content === prefix || message.content.startsWith(prefix + ' ')) prefix = `<@!${client.user.id}>`
        if (!message.content.startsWith(prefix) || message.content === prefix || message.content.startsWith(prefix + ' ')) return
        const args = message.content.slice(prefix.length).trim().split(/ +/g)
        const commandName = args[0].toLowerCase().normalize()
        console.log(client.commands)
        const cmd = client.commands.get(commandName) || client.aliases.get(commandName)
        if (!cmd) return
        try {
            args.shift()
            cmd.run(client, message, args, commandName)
        } catch (err) {
            console.log(err)
        }

    }
}