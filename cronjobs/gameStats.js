const https = require('https');

function postData(gameData) {
  const options = {
    host: 'api.gaymers.gg',
    path: '/stats',
    method: 'POST'
  };

  let responseBody = [];

  const request = https.request(options, (response) => {
    response.on('data', (chunk) => {
      responseBody.push(chunk);
    });

    response.on('end', () => {
      responseBody = Buffer.concat(responseBody).toString();
      console.log(responseBody);
    });
  });

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
