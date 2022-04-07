const { getStream, getUser, getGame } = require('./twitch-api.js');

const { twitch } = require('../../config/config.js');

module.exports = async (member) => {
    console.log('[Twitch] Monitorando a stream!');
    const stream = await getStream(twitch.STREAMER);
    const user = await getUser(twitch.STREAMER)
    const game = await getGame(twitch.STREAMER)

    console.log(stream, user, game);
};