const Discord = require('discord.js');

module.exports = {
    name: "ping",
    aliases: ["speed", "latency"], 
    description: "Voir la latence du bot", 
    usage: "-ping", 
    run: async(client, message, args, lang) => {
        let msg = message.channel.send("Calcul..."); 
        let embed = new Discord.MessageEmbed()
        .setDescription(`Bot : ${client.ws.ping} ms\nAPI : ${(await msg).createdAt - message.createdAt} ms`)
        .setColor("BLACK");

        (await msg).edit({content: " ", embeds: [embed]});
    }
}