module.exports = {
  // Logs a member being banned in #user-logs.
  process: (bot, Guild, User) => {
    const userLogsChannel = Guild.channels.find('name', 'user-logs');

    userLogsChannel.send(
      ':no_entry_sign: ' +
      User.toString() + ' ' +
      '(' + User.username + ') ' +
      '`' + User.id + '` banned at ' +
      new Date().toUTCString()
    );
  }
};
