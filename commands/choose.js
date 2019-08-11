const splitargs = require('splitargs');

module.exports = {
  usage: '[Option 1] [Option 2] [etc]',
  description: 'Let DiscoBot choose for you.',
  allowDM: true,
  process: (bot, message) => {

    const responses = [
      'I think "%" is the best choice',
      'I\'ve decided on "%"',
      'Definitely "%"',
      '"%" would be best',
      'After much deliberation, "%"',
      'I reckon "%"',
      'I choose "%"'
    ];

    const choices = splitargs(message.content);
    choices.shift();

    if (choices.length === 0) {
      message.reply('Usage: `!choose ' + module.exports.usage + '`');
      return;
    }

    const choice = choices[Math.floor(Math.random() * choices.length)];
    const response = responses[Math.floor(Math.random() * responses.length)].replace('%', choice);
    message.reply(response);
  }
};
