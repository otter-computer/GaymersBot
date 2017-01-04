const moment = require('moment');
const format = require('../momentFormat');

// For the special little snowflake...
const REYNBOW = {
  'id': '123395731548536832',
  'joinedAt': moment('2015-12-27T01:00:00Z'),
  'message': '{{USER}} BOUNCED IN HERE LIKE A FEISTY \'ROO ABOUT ' +
      '{{DURATION}} ({{TIMESTAMP}}), MATE.'
}

module.exports = {
  usage: '[@user]',
  description: 'See when someone joined the server.',
  allowDM: false,
  process: (bot, message) => {
    message.mentions.users.forEach(user => {
      // Handle the snowflake case
      if (user.id === REYNBOW.id) {
        let reply = REYNBOW.message
          .replace('{{USER}}', user)
          .replace('{{DURATION}}', REYNBOW.joinedAt.fromNow())
          .replace('{{TIMESTAMP}}', REYNBOW.joinedAt.format(format));
        message.channel.sendMessage(reply.toUpperCase());
        return;
      }

      const joined = moment(message.guild.member(user).joinedAt);
      message.channel.sendMessage(user + ' joined ' + joined.fromNow() +
          ' (' + joined.format(format) + ')');
    });
  }
};
