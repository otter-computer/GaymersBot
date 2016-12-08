const moment = require('moment');
const format = require('../momentFormat');

function usernameUpdate(bot, oldMember, newMember) {
  let channel = bot.channels.find('name', 'user-logs');

  let oldMemberName, newMemberName;

  if (!oldMember.nickname) {
    oldMemberName = '**' + oldMember.user.username + '**#' + oldMember.user.discriminator;
  } else {
    oldMemberName = '**' + oldMember.nickname + '**#' + oldMember.user.discriminator;
  }

  if (!newMember.nickname) {
    newMemberName = '**' + newMember.user.username + '**#' + newMember.user.discriminator;
  } else {
    newMemberName = '**' + newMember.nickname + '**#' + newMember.user.discriminator;
  }

  channel.sendMessage(
    oldMemberName + ' is now ' + newMemberName + ' ' +
    '(' + moment(Date.now()).format(format) + ')'
  );
}

module.exports = {
  process: (bot, guild, oldMember, newMember) => {
    // Nickname change
    //if (oldMember.nickname !== newMember.nickname) {
    //  usernameUpdate(bot, oldMember, newMember);
    //}
  }
};
