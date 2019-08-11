function usernameUpdate(bot, oldMember, newMember) {
  const userLogsChannel = newMember.guild.channels.find('name', 'user-logs');

  let messageString = ':abcd: ' + newMember.user.toString() + '(' + newMember.user.username + ') ' + ' `' + newMember.id + '`';

  // User changed account username
  if (oldMember.user.username !== newMember.user.username) {
    messageString += 'changed account username from "' + oldMember.user.username + '"';
  }

  // User adds a nickname
  if (!oldMember.nickname && newMember.nickname) {
    messageString += ' added nickname "' + newMember.displayName + '"';
  }

  // User removes a nickname
  if (oldMember.nickname && !newMember.nickname) {
    messageString += ' removed nickname "' + oldMember.displayName + '"';
  }

  if (oldMember.nickname && newMember.nickname &&
    oldMember.nickname != newMember.nickname) {
    messageString += ' changed nickname from "' + oldMember.displayName + '"';
  }

  messageString += ' at ' + new Date().toUTCString();

  userLogsChannel.send(messageString);
}



function memberRestricted(member) {
  // Remove the 'Member' role if someone gains the 'Restricted' role.
  // This is needed because in Discord an 'ALLOW' permission takes precedence
  // over a 'DENY' permission, which results in the 'ALLOW's from 'Member'
  // keeping 'Restricted' from working.
  const eighteenRole = member.guild.roles.find('name', '18+');
  member.removeRoles([eighteenRole])
    .then(
      () => { },
      reason => {
        // TODO Rejection handler
        console.error(reason);
      }
    )
    .catch(e => {
      // TODO Error handler
      console.error(e);
    });

  // If the member is in a voice chat, move them to AFK
  if (member.voiceChannel) {
    let afkVoiceChannel = member.guild.afkChannelID;

    if (!afkVoiceChannel) {
      // If there's no AFK channel defined by the server owner, look for a
      // channel named 'AFK'
      console.error('There is no server AFK channel, searching for a ' +
        'channel named AFK...');
      afkVoiceChannel = member.guild.channels.filter(value => {
        return value.type === 'voice' && value.name.toUpperCase() === 'AFK';
      }).first();

      if (!afkVoiceChannel) {
        // There's neither server-defined AFK channel nor a channel named
        // 'AFK'?! Fall back to a mute.
        member.setMute(true);
        console.error('There is neither a server AFK channel nor a channel ' +
          'named AFK.');
        // TODO Error handler
        return;
      }
    }

    member.setVoiceChannel(afkVoiceChannel);
  }
}

module.exports = {
  process: (bot, oldMember, newMember) => {

    // Nickname change
    if (oldMember.nickname !== newMember.nickname ||
      oldMember.user.username !== newMember.user.username) {
      usernameUpdate(bot, oldMember, newMember);
    }

    // User gained the 'Restricted' role
    if (!oldMember.roles.findKey('name', 'Restricted') &&
      newMember.roles.findKey('name', 'Restricted')) {
      memberRestricted(newMember);
    }
  }
};
