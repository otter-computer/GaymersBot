const firebase = require('firebase');

module.exports = {
  usage: '[service] [username]',
  description: 'Save your gamertag/username for any gaming service to ' +
    'the database.',
  process: (bot, message) => {
    let msg = message.content;

    // Remove backticks because they can be injected to break the !getinfo
    // output.
    msg = msg.replace(/`/g, '');

    // Some users mis-read the usage text and assume that they need to
    // surround the names with square brackets. Let's just tolerate their
    // ignorance. (replace '[' or ']' with '')
    msg = msg.replace(/\[|\]/g, '');

    // Split into command arguments
    msg = msg.split(' ');

    // The first entry will be '!setinfo'
    msg.shift();

    // There should be at least two more members, one service and one username
    if (msg.length < 2) {
      message.reply('Sorry, I don\'t know what you\'re trying to set. ' +
          ':frowning: Try using the command like this: ' +
          '```!setinfo [service] [username]```');
      return;
    }

    const service = msg[0].toLowerCase();

    // Remove service name from msg, leaving only username
    msg.shift();

    // Re-join the rest of the parameters back with spaces
    const username = msg.join(' ');

    if (service.length === 0 || username.length === 0) {
      message.reply('You need to include both a service and a username ' +
          'when trying to save your info. Try using the command ' +
          'like this: ```!setinfo [service] [username]```');
      return;
    }

    var updates = {};

    updates['/users/info/' + message.author.id + '/' + service] = username;

    firebase.database().ref().update(updates);

    message.reply('I\'ve updated your info! :ok_hand: Use `!getinfo` to ' +
        'see the changes.');
  }
};
