module.exports = {
  usage: '[@user]',
  description: 'See someone\'s avatar.',
  process: (bot, message) => {
    for (var [id, user] of message.mentions.users) {
      message.channel.sendMessage(user + '\'s avatar: ' + user.avatarURL);
    }
  }
};
