const { getStream, getUser, getGame } = require('./twitch-api.js');
const { twitch } = require('../../config/config.js');
const GuildSettings = require("../../models/GuildSettings");
const CronJob = require('cron').CronJob;
const Discord = require("discord.js");

module.exports = async (client) => {
    console.log('[Twitch] Monitorando a stream!');
    new CronJob('* * * * *', async () => {
        
        const stream = await getStream(twitch.STREAMER);
        const user = await getUser(twitch.STREAMER);
        const game = await getGame(twitch.STREAMER);
        
        if (!stream) return;
        
        if(stream.type == 'live'){
            const streamData = await GuildSettings.findOne({
                user_id: user.id
            });
            const channel = client.channels.cache.get(streamData.notification_channel_id);

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
                    
                    
            if (!streamData) {
                client.streams.set(channel.guild.id, user.id);
                        

                const message = await channel.send({
                    embeds: [newNotifierEmbed]
                });

                await message.react('<:twitch:956700382938165279>');

                return await GuildSettings.create({
                    user_id: user.id,
                    stream_id: stream.id,
                    message_id: message.id
                })
            } else if (streamData.stream_id == stream.id) {
                client.streams.set(channel.guild.id, user.id);
    
                let message = streamData.message_id
                    ? await channel.messages
                        .fetch(streamData.message_id)
                        .then((msg) => msg.edit({embeds: [newNotifierEmbed]}))
                        .catch(() => channel.send({embeds: [newNotifierEmbed]}))
                    : await channel.send({embeds: [newNotifierEmbed]});
                
                await message.react('<:twitch:956700382938165279>');
    
                await streamData.updateOne({
                    user_id: user.id,
                    stream_id: stream.id,
                    message_id: message.id
                })
            } else {
                client.streams.set(channel.guild.id, user.id);

                const message = await channel.send({
                    embeds: [newNotifierEmbed]
                });

                await message.react('<:twitch:956700382938165279>');

                await streamData.updateOne({
                    user_id: user.id,
                    stream_id: stream.id,
                    message_id: message.id
                })
            };
        };
    }).start();
};