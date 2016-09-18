const firebase = require('firebase');

module.exports = {
  usage: '[service (optional)]',
  description: 'Delete a gamertag/username, or all your saved data.',
  process: (bot, message) => {
    let msg = message.content.split(' ');

    let service = msg[1];
    if (service) service.replace('[','').replace(']','').toLowerCase();

    var updates = {};

    if (!service || service.length < 1) {
      // Null everything about the user
      updates['/users/info/' + message.author.id + '/'] = null;
    } else {
      // Null a specific service
      updates['/users/info/' + message.author.id + '/' + service] = null;
    }

    firebase.database().ref().update(updates);

    if (!service || service.length < 1) {
      message.reply('I\'ve removed all your saved data. :smile:');
    } else {
      message.reply('I\'ve removed your saved data for ' + service + '. :smile:');
    }
  }
};
