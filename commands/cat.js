const request = require('request');

module.exports = {
  usage: '',
  description: 'Gets a random cat picture.',
  process: (bot, message) => {
    // http://random.cat/meow
    request('http://random.cat/meow', (error, response, body) => {
      if (error) {
        console.log('Error: ', error);
        return;
      }

      if (response.statusCode !== 200) {
        console.log('Invalid status code: ', response.statusCode);
        return;
      }

      message.reply(JSON.parse(body).file);
    });
  }
};
