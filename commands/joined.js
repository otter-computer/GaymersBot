const moment = require('moment');
const format = require('../momentFormat');

module.exports = {
  usage: '[@user]',
  description: 'See when someone joined the server.',
  allowDM: false,
  process: (bot, message) => {
    for (var [id, user] of message.mentions.users) {

      if (id === '123395731548536832') { // If Reynbow.

        var dr = moment('2015-12-27 01:00');
        var now = dr.fromNow().toUpperCase();
        message.channel.sendMessage(user.toString() + ' BOUNCED IN HERE LIKE A FEISTY \'ROO ABOUT ' + now + ' (' + dr.format(format).toUpperCase() + '), MATE.');

        return;
      }

      let joinDate = moment(message.guild.member(user).joinedAt);

      message.channel.sendMessage(user.toString() + ' joined ' + joinDate.fromNow() + ' (' + joinDate.format(format) + ')');
    }
  }
};
