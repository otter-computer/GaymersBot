module.exports = {
  usage: '[@user]',
  description: 'See someone\'s avatar.',
  allowDM: true,
  process: (bot, message) => {
    if (!message.mentions.users.first() ||
        message.mentions.users.first() === message.author) {
      if (message.author.avatarURL) {
        message.channel.sendMessage('Your avatar: ' +
          message.author.avatarURL);
      } else {
        message.reply('You don\'t have an avatar :sob:');
      }
      return;
    }

    const user = message.mentions.users.first();
    if (user.avatarURL) {
      message.channel.sendMessage(user + '\'s avatar: ' + user.avatarURL);
    } else {
      message.channel.sendMessage(user + ' doesn\'t have an avatar :sob:');
    }
  }
};
