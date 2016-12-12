module.exports = {
  usage: '[@user]',
  description: 'BOOP',
  allowDM: true,
  process: (bot, message) => {

    const boopReplies = [
      '*boops $USER*',
      '*boops $USER right on the schnozz*',
      '*boops $USER right on the honker*'
    ];

    let user;

    if (message.mentions.users.first()) {
      user = message.mentions.users.first();
    } else {
      user = message.author;
    }

    message.channel.sendMessage(boopReplies.random().replace('$USER', user));
  }
};
