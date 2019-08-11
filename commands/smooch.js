module.exports = {
  usage: '[@user]',
  description: 'Give someone a smooch :kiss:',
  allowDM: true,
  process: (bot, message) => {

    const smoochReplies = [
      '*kisses $USER*',
      '*kisses $USER*',
      '$USER :kiss:',
      '$USER :kiss:',
      '*lands a big wet one on $USER\'s cheek*',
      '*plays tonsil hockey with $USER*',
      '*puckers up for $USER*',
      '$USER :tongue:'
    ];

    let user;

    if (message.mentions.users.first()) {
      user = message.mentions.users.first();
    } else {
      user = message.author;
    }

    message.channel.send(smoochReplies[Math.floor(Math.random() * smoochReplies.length)].replace('$USER', user));
  }
};
