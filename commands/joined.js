const moment = require('moment');
const format = require('../momentFormat');

module.exports = {
  usage: '[@user]',
  description: 'See when someone joined the server.',
  process: (bot, message) => {
    for (var [id, user] of message.mentions.users) {
      let joinDate = moment(message.guild.member(user).joinDate);

      message.channel.sendMessage(user.toString() + ' joined ' + joinDate.fromNow() + ' (' + joinDate.format(format) + ')');

      message.channel.sendMessage('**DEBUG:** Here\'s the unix timestamp for '  + user.toString() + ': ' + message.guild.member(user).joinDate);
    }
  }
};
