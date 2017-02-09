const https = require('https');

function postData(gameData) {
  const options = {
    host: 'api.gaymers.gg',
    path: '/userdata',
    method: 'POST',
    headers: {
      'x-api-key': process.env.APIGW_discobot_x-api-key
    }
  };

  const request = https.request(options);

  request.write(JSON.stringify(gameData));
  request.end();
}

module.exports = {
  process: (bot) => {
    const guild = bot.guilds.first();
    const members = guild.members;

    let updates = [];

    MemberLoop:
    for (let [id, user] of members) {    
      updates.push({
        userid: id,
        username: user.username,
        discriminator: user.discriminator,
        avatar: user.avatar,
        member: 0
      });
    }

    postData(updates);
  }
};
