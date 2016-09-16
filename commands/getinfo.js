const firebase = require('firebase');

module.exports = {
  usage: '[service (optional)] [@user (optional)]',
  description: 'Get info on a user',
  process: (bot, message) => {

    let user;

    if (message.mentions.users.first()) {
      user = message.mentions.users.first();
    } else {
      user = message.author;
    }

    let msg = message.content.split(' ');
    let service;

    // Get the service, if any
    for (let i = 1; i < msg.length; i++) {

      if (!msg[i].startsWith('<')) {
        if (!service) {
          service = '';
        } else {
          service += ' ';
        }

        service += msg[i];
      }
    }

    // If a specified service
    if (service) {
      let getData = firebase.database().ref('/users/info/' + user.id + '/' + service);

      getData.on('value', (snapshot) => {
        // Check for data
        if (snapshot.val()) {

          if (user === message.author) {
            message.reply('here\'s your ' + service + ' username:\n```' + snapshot.val() + '```');
          } else {
            message.reply('here\'s the ' + service + ' username for' + user + ':\n```' + snapshot.val() + '```');
          }

        } else {
          // No data
          if (user === message.author) {
            message.reply('sorry, I don\'t have any ' + service + ' data for you. :sob:');
          } else {
            message.reply('sorry, I don\'t have any ' + service + ' data for ' + user + '. :sob:');
          }
        }

        // Close the listener so it doesn't stay open forever
        getData.off(); // 😏 http://i.giphy.com/dmB5vD2t2gR8Y.gif
      });

    } else {
      // No service specified
      let getData = firebase.database().ref('/users/info/' + user.id);

      getData.on('value', (snapshot) => {
        // Check for data
        if (snapshot.val()) {
          let data = snapshot.val();
          console.log('snapshot', data);

          let msg = '';

          if (user === message.author) {
            msg += 'here\'s your info:\n```';
          } else {
            msg += 'here\'s the info for ' + user + ':\n```';
          }

          for (var i in data) {
            console.log(i, data[i]);
            msg += i + ': ' + data[i] + '\n';
          }

          msg += '```';

          message.reply(msg);
        } else {
          // No data
          if (user === message.author) {
            message.reply('sorry, I don\'t have any data for you. :sob:');
          } else {
            message.reply('sorry, I don\'t have any data for ' + user + '. :sob:');
          }
        }

        // Close the listener so it doesn't stay open forever
        getData.off(); // 😏 http://i.giphy.com/dmB5vD2t2gR8Y.gif
      });
    }
  }
};
