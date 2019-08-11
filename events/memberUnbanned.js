module.exports = {
  // Logs a member being unbanned in #user-logs.
  process: (bot, Guild, User) => {
    const userLogsChannel = Guild.channels.find('name', 'user-logs');

    userLogsChannel.send(
      ':recycle: ' +
      User.toString() + ' ' +
      '(' + User.username + ') ' +
      '`' + User.id + '` unbanned at ' +
      new Date().toUTCString()
    );
  }
};
