const request = require('request');

module.exports = {
  usage: '',
  description: 'Gets a random penguin picture.',
  process: (bot, message) => {
    // http://penguin.wtf
    request('http://penguin.wtf', (error, response, body) => {
      if (error) {
        console.log('Error: ', error);
        return;
      }

      if (response.statusCode !== 200) {
        console.log('Invalid status code: ', response.statusCode);
        return;
      }

      message.reply(body);
    });
  }
};
