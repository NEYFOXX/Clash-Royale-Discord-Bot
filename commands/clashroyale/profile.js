const Discord = require('discord.js'); 
const axios = require('axios'); 
const {bot} = require('../../structure/client'); 

module.exports = {
    name: "profil", 
    aliases: ["ui", "userprofile", "infos", "userinfo"],
    description: "Voir le profile du pseudo précisé", 
    usage: "-profile <tag>",
    /**
     * 
     * @param {bot} client 
     * @param {Discord.Message} message 
     * @param {String[]} args 
     */ 
    run: async(client, message, args) => {
        let user = message.mentions.members.first() || message.guild.members.cache.get(args[0]) || message.member; 
        if(client.db["profile"].get(`profile_${user.user.id}`)){
        const cc = await axios(`https://api.clashroyale.com/v1/players/${encodeURIComponent(client.db["profile"].get(`profile_${user.user.id}`))}`, {
            headers: {
                Authorization: `Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzUxMiIsImtpZCI6IjI4YTMxOGY3LTAwMDAtYTFlYi03ZmExLTJjNzQzM2M2Y2NhNSJ9.eyJpc3MiOiJzdXBlcmNlbGwiLCJhdWQiOiJzdXBlcmNlbGw6Z2FtZWFwaSIsImp0aSI6ImMyMTQyNjhlLWIyZWEtNDliMi04ZDI0LTc3MjY2ZjYxMzgwNiIsImlhdCI6MTY0NzcxNTE5Nywic3ViIjoiZGV2ZWxvcGVyLzNjNjA0NDkwLTIxZGEtYTgwZC1iNDZkLTk5NjhjZTY5YWFjOSIsInNjb3BlcyI6WyJyb3lhbGUiXSwibGltaXRzIjpbeyJ0aWVyIjoiZGV2ZWxvcGVyL3NpbHZlciIsInR5cGUiOiJ0aHJvdHRsaW5nIn0seyJjaWRycyI6WyI3OS44Mi43Mi4xOTQiXSwidHlwZSI6ImNsaWVudCJ9XX0.4oaqSnkQEcbC8lrv6ld04R-fBmq8sX6_e4cJVxNFYuqHXhWwfgMu8yOR8tGyMT7jiVhVaJo2RuPKqJuNQj-X-Q`
            }
        }).then((data) => {
            let currentdeck = data.data.currentDeck.map(function(deck) {return `${deck.name} - niveau ${deck.level}`}).join("\n"); 
            let arene = data.data.arena.name.replace("Arena", "Arène");
            let currentfavoritecard = data.data.currentFavouriteCard.name; 
            let games = data.data.battleCount; 
            let wins = data.data.wins;
            let lose = data.data.losses; 
            let exp = data.data.expLevel;
            let expcurrent = data.data.expPoints; 

            let embed = new Discord.MessageEmbed()
            .setTitle(`${data.data.name}`)
            .setDescription(`**Tag :** ${data.data.tag}\n**Trophées :** ${data.data.trophies}\n**Arène :** ${arene}\n**Carte favorite :** ${currentfavoritecard}\n**Nombre de partie(s) jouée(s) :** ${games}\n**Nombre de partie(s) gagnée(s) :** ${wins} ( ${data.data.threeCrownWins} avec 3 couronnes )\n**Nombre de partie(s) perdue(s) :** ${lose}\n**Exp :** ${expcurrent} points ( level ${exp} )\n**Deck actuel :** \n${currentdeck}`)
            .setColor("BLURPLE"); 

            message.channel.send({embeds : [embed]}); 
        })
    } else return message.channel.send(`<@${user.id}> doit d'abord s'enregistrer avec son pseudo Clash Royale`)
    } 
}