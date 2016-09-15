const firebase = require('firebase');

module.exports = {
  usage: 'add/remove [role]',
  description: 'Set or remove a role from yourself',
  process: (bot, message) => {
    let msg = message.content.split(' ');

    let service = msg[1].replace('[','').replace(']','').toLowerCase();

    let username = '';

    // Concat username with spaces
    for (let i = 2; i < msg.length; i++) {
      if (username.length > 1) username += ' ';

      username += msg[i].replace('[','').replace(']','');
    }

    var updates = {};

    updates['/users/' + message.author.id + '/' + service] = username;

    firebase.database().ref().update(updates);

    message.reply('I\'ve saved your ' + service + ' username as ' + username + '. :smile:');
  }
};
