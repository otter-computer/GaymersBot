module.exports = {
  // Logs a member leaving in #user-logs.
  process: (bot, GuildMember) => {
    const User = GuildMember.user;
    const userLogsChannel = GuildMember.guild.channels.find('name', 'user-logs');

    userLogsChannel.send(
      ':runner: ' +
      User.toString() + ' ' +
      '(' + User.username + ') ' +
      '`' + User.id + '` left at ' +
      new Date().toUTCString()
    );
  }
};
