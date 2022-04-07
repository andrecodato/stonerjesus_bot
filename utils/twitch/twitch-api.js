const { twitch } = require ('../../config/config.js');
const fetch = require('node-fetch');

const get = async (url) => {
    try {
        const req = await fetch(url, {
            headers: { 
                'Client-ID': twitch.CLIENT_ID,
                'Authorization': 'Bearer ' + twitch.TOKEN
            }
        });

        const res = await req.json()
        console.log(res);

        return res.data.length ? res.data[0] : null;
    } catch (err) {
        return console.error(err);
    }
};

const getUser = async (user) => {
    return await get(`https://api.twitch.tv/helix/users?login=${user}`)
};

const getStream = async (user) => {
	return await get(`https://api.twitch.tv/helix/streams?user_login=${user}`);
};

const getGame = async (id) => {
	return await get(`https://api.twitch.tv/helix/games?id=${id}`);
};

module.exports = {get, getUser, getStream, getGame};