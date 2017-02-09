const https = require('https');

function postData(users) {
  const options = {
    host: 'api.gaymers.gg',
    path: '/userdata',
    method: 'POST',
    headers: {
      'x-api-key': process.env.APIGW_DISCOBOT_X_API_KEY
    }
  };

  const request = https.request(options);

  request.write(JSON.stringify(users));
  request.end();
}

module.exports = {
  process: (bot) => {
    console.log('Running memberInfo cron');
    const guild = bot.guilds.first();
    const members = guild.members;

    let updates = [];

    for (let [id, member] of members) {
      updates.push({
        userid: id,
        username: member.user.username,
        discriminator: member.user.discriminator,
        avatar: member.user.avatar,
        member: member.roles.exists('name', 'Member') ? 1 : 0
      });
    }

    postData(updates);
  }
};
