module.exports = {
    name: 'ready', 
    run: async(client) => {
        console.log(`Prêt sur ${client.user.username}`)
    }
}