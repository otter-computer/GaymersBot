const firebase = require('firebase');

module.exports = {
  usage: 'add/remove [role]',
  description: 'Set or remove a role from yourself',
  process: (bot, message) => {
    let msg = message.content.split(' ');

    let service = msg[1];

    if (!service || service.length < 1) {
      message.reply('Sorry, I don\'t know what you\'re trying to set. :frowning: Try using the command like this: ```!setinfo [service] [username]```');
      return;
    }

    service.replace('[','').replace(']','').toLowerCase();

    let username = '';

    // Concat username with spaces
    for (let i = 2; i < msg.length; i++) {
      if (username.length > 1) username += ' ';

      username += msg[i].replace('[','').replace(']','');
    }

    if (username.length < 1) {
      message.reply('You need to include a username when trying to save your info. Try using the command like this: ```!setinfo [service] [username]```');
      return;
    }

    var updates = {};

    updates['/users/info/' + message.author.id + '/' + service] = username;

    firebase.database().ref().update(updates);

    message.reply('I\'ve saved your ' + service + ' username as ' + username + '. :smile:');
  }
};
