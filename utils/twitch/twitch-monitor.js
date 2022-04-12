const { getStream, getUser, getGame } = require('./twitch-api.js');
const { twitch } = require('../../config/config.js');
const GuildSettings = require("../../models/GuildSettings");
const CronJob = require('cron').CronJob;
const Discord = require("discord.js");

module.exports = async (client) => {
    console.log('[Twitch] Monitorando a stream!');
    new CronJob('0 * * * *', async () => {
        const channel = client.channels.cache.get(guildSettings.notification_channel_id);

        const stream = await getStream(twitch.STREAMER);
        const user = await getUser(twitch.STREAMER)
        const game = await getGame(twitch.STREAMER)
        
        // console.log(channel, stream, user, game);

        if (!stream) return;

        if(stream.type == 'live'){
            console.log('[Twitch] Notificando live');
            const newNotifierEmbed = new Discord.MessageEmbed()
                .setColor('#A233FF')
                .setTitle('🔵 LIVE ON')
                .setURL(`https://twitch.tv/${user.user_name}`)
                .setThumbnail(client.user.displayAvatarURL())
                .setFields(
                    {name:'Título:', value : `${stream.title}`},
                    {name:'Jogando:', value: `${game}`, inline: true},
                    {name:'Viewers:', value: `${stream.viewer_count}`, inline: true}
                )
                .setImage(stream.getThumbnailUrl())
                .setTimestamp()
                .setFooter({text:'Stoner Jesus', iconURL:`${client.user.displayAvatarURL()}`})
            if (!guildSettings.message_id){
                const guildSettings = await GuildSettings.findOne({
                    guild_id: client.user.id
                });
                if (!guildSettings && !guildSettings.notification_channel_id) return;

                const message = await channel.send({
                    embeds: [newNotifierEmbed]
                });

                await message.react("<:twitch:956700382938165279>");

                guildSettings.message_id = message.id;
                guildSettings.save(err => {
                    if (err) {
                        interaction.reply("Ocorreu um erro ao salvar as configurações!");
                        return;
                    }
                });
            }
        };
    }).start();
};