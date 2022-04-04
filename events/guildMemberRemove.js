const Discord = require("discord.js")

module.exports = {
    name: "guildMemberRemove",
    async execute (member) {
        // member.guild.channels.cache.get("960661727064752138").send(`${member.user} entrou no server!`)

        const newMemberEmbed = new Discord.MessageEmbed()
            .setColor("#FF4633")
            .setTitle("Até a próxima")
            .setDescription(`${member.user} saiu do servidor!`)
            .setThumbnail(member.user.displayAvatarURL())
            .setTimestamp();

        member.guild.channels.cache.get("960661727064752138").send({
            embeds: [newMemberEmbed]
        })
    }
}