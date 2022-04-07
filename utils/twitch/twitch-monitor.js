const { getUser, getStream, getGame } = require('./twitch-api.js');

const { twitch } = require('../../config/config.js');

module.exports = async (member) => {
    console.log('[Twitch] Monitorando a stream!');
    const user = await getUser(twitch.STREAMER, member);
    const stream = await getStream(twitch.STREAMER, member);
    const game = await getGame(stream.game_id, member);

    console.log(user, stream, game);
};