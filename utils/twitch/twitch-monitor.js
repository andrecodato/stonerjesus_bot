const { getStream, getUser, getGame } = require('./twitch-api.js');
const { twitch } = require('../../config/config.js');
const GuildSettings = require("../../models/GuildSettings");
const CronJob = require('cron').CronJob;
const Discord = require("discord.js");

module.exports = async (client) => {
    console.log('[Twitch] Monitorando a stream!');
    new CronJob('* * * * * *', async () => {
        const guildSettings = await GuildSettings.findOne({ guild_id: client.user.id });
        if (!guildSettings && !guildSettings.notification_channel_id) return;

        const channel = client.channels.cache.get(guildSettings.notification_channel_id);

        const stream = await getStream(twitch.STREAMER);
        const user = await getUser(twitch.STREAMER)
        const game = await getGame(twitch.STREAMER)

        console.log(channel, stream, user, game);

    }).start();
};