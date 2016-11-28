// TODO: Actually make this work...

const request = require('request');

module.exports = {
  usage: '',
  description: 'Gets a random cat picture.',
  process: (bot, message) => {
    request('https://www.reddit.com/r/dogpictures.json', (error, response, body) => {
      if (error) {
        console.log('Error: ', error);
        return;
      }

      if (response.statusCode !== 200) {
        console.log('Invalid status code: ', response.statusCode);
        return;
      }

      let jData = JSON.parse(body);
      let dogs = jData.data.children;
      let images = [];

      for (var dog in dogs) {
        console.log('dog', dog);
        if (dog.kind == 't3') {
          images.push(dog);
        }
      }

      let image = images[Math.floor(Math.random() * images.length)];

      message.reply(image.data.preview.images.source.url);
    });
  }
};
