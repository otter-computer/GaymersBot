module.exports = {
  usage: '[@user]',
  description: 'Spray someone thirsty...',
  allowDM: true,
  process: (bot, message) => {

    const sprayReplies = [
      '*sprays $USER with a fire hose.*'
    ];

    const spraySpecial = '*sprays $USER with canned cheese.*';

    let user;

    if (message.mentions.users.first()) {
      user = message.mentions.users.first();
    } else {
      user = message.author;
    }

    if (Math.floor(Math.random() * 50) + 1 === 50) {
      message.channel.send(spraySpecial.replace('$USER', user));
    } else {
      message.channel.send(sprayReplies[Math.floor(Math.random() * sprayReplies.length)].replace('$USER', user));
    }
  }
};
