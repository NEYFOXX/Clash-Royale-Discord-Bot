const Discord = require('discord.js'); 
const {bot} = require('../../structure/client'); 
const axios = require('axios'); 

module.exports = {
    name: "register", 
    aliases: ["save"], 
    description: "Enregistrer son pseudo clash royale", 
    usage: "+register <CRtag>", 
    /**
     * 
     * @param {bot} client 
     * @param {Discord.Message} message 
     * @param {String[]} args 
     */
    run: async(client, message, args) => {
        let tag = args[0]
        if(!tag) return message.channel.send("Donnez moi votre tag Clash Royale"); 

        const cc = await axios(`https://api.clashroyale.com/v1/players/${encodeURIComponent(tag)}`, {
            headers: {
                Authorization: "Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzUxMiIsImtpZCI6IjI4YTMxOGY3LTAwMDAtYTFlYi03ZmExLTJjNzQzM2M2Y2NhNSJ9.eyJpc3MiOiJzdXBlcmNlbGwiLCJhdWQiOiJzdXBlcmNlbGw6Z2FtZWFwaSIsImp0aSI6ImMyMTQyNjhlLWIyZWEtNDliMi04ZDI0LTc3MjY2ZjYxMzgwNiIsImlhdCI6MTY0NzcxNTE5Nywic3ViIjoiZGV2ZWxvcGVyLzNjNjA0NDkwLTIxZGEtYTgwZC1iNDZkLTk5NjhjZTY5YWFjOSIsInNjb3BlcyI6WyJyb3lhbGUiXSwibGltaXRzIjpbeyJ0aWVyIjoiZGV2ZWxvcGVyL3NpbHZlciIsInR5cGUiOiJ0aHJvdHRsaW5nIn0seyJjaWRycyI6WyI3OS44Mi43Mi4xOTQiXSwidHlwZSI6ImNsaWVudCJ9XX0.4oaqSnkQEcbC8lrv6ld04R-fBmq8sX6_e4cJVxNFYuqHXhWwfgMu8yOR8tGyMT7jiVhVaJo2RuPKqJuNQj-X-Q"
            }
        }).then((data) => {
            if(data.status !== 200 || data.data.reason === "notFound") return message.channel.send("Tag invalide"); 
            const user = data.data; 

            message.channel.send(`Félicitations vous êtes désormais enregistré !\nVotre pseudo : **${user.name}**`); 
            client.db["profile"].set(`profile_${message.author.id}`, `${tag}`).save();
        })
    }
}