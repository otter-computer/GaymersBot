const https = require('https');

function postData(gameData) {
  const options = {
    host: 'api.gaymers.gg',
    path: '/stats',
    method: 'POST'
  };

  const request = https.request(options);

  request.write(JSON.stringify(gameData));
  request.end();
}

module.exports = {
  process: (bot) => {
    const guild = bot.guilds.first();
    const users = guild.presences;

    let updates = [];

    for (let [id, presence] of users) {
      if (presence.game) {
        updates.push({
          user: id,
          game: presence.game.name
        });
      }
    }

    postData(updates);
  }
};
