module.exports = {
  usage: '[@user]',
  description: 'See someone\'s avatar.',
  allowDM: true,
  process: (bot, message) => {
    for (var [id, user] of message.mentions.users) {
      if (user.avatarURL) {
        message.channel.sendMessage(user + '\'s avatar: ' + user.avatarURL);
      } else {
        message.channel.sendMessage(user + ' doesn\'t have an avatar :sob:');
      }
    }
  }
};
