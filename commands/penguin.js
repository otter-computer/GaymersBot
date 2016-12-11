const request = require('request');

module.exports = {
  usage: '',
  description: 'Gets a random penguin picture.',
  allowDM: true,
  process: (bot, message) => {
    // http://penguin.wtf
    request('http://penguin.wtf', (error, response, body) => {
      try {
        if (error) {
          console.log('Error: ', error);
          return;
        }

        if (response.statusCode !== 200) {
          console.log('Invalid status code: ', response.statusCode);
          return;
        }

        message.reply(body);
      } catch (e) {
        console.error(e.stack);
      }
    });
  }
};
