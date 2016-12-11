module.exports = {
  usage: '[@user]',
  description: 'Give someone a hug :blush:',
  allowDM: true,
  process: (bot, message) => {

    const hugReplies = [
      '*hugs $USER*',
      '*hugs $USER*',
      '*hugs $USER*',
      '*hugs $USER*',
      '*licks $USER*',
      '*pounces $USER*',
      '*jumps on $USER*',
      '*glomps $USER*',
      '*falls on $USER*',
      '*bear hugs $USER*',
      '*tightly squeezes $USER*',
      '*embraces $USER*',
      '*holds $USER close*',
      '*cuddles $USER*',
      '*takes $USER into his arms*'
    ];

    let user;

    if (message.mentions.users.first()) {
      user = message.mentions.users.first();
    } else {
      user = message.author;
    }

    message.channel.sendMessage(hugReplies.random().replace('$USER', user));
  }
};
