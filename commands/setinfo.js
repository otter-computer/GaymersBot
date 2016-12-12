const firebase = require('firebase');

// Valid service name is ASCII alphanumeric only
const VALID_SERVICE_NAME = /^(?:[a-z]|[A-Z]|[0-9])+$/;
// Valid username is all ASCII characters from ' ' to '~' except '`'
const VALID_USERNAME = /^(?:[ -_]|[a-~])+$/;

module.exports = {
  usage: '[service] [username]',
  description: 'Save your gamertag/username for any gaming service to ' +
    'the database.',
  allowDM: true,
  process: (bot, message) => {
    // Split into command arguments
    const msg = message.content.split(' ');

    // The first entry will be '!setinfo'
    msg.shift();

    // There should be at least two more members, one service and one username
    if (msg.length < 2) {
      message.reply('Sorry, I don\'t know what you\'re trying to set. ' +
          ':frowning: Try using the command like this: ' +
          '```!setinfo [service] [username]```');
      return;
    }

    const service = msg[0];

    // Check that service only contains the valid characters
    if (!VALID_SERVICE_NAME.test(service)) {
      message.reply('Sorry, the service name must be alphanumeric :frowning2:');
      return;
    }

    // Remove service name from msg, leaving only username
    msg.shift();

    // Re-join the rest of the parameters back with spaces
    const username = msg.join(' ');

    if (!VALID_USERNAME.test(username)) {
      message.reply('Sorry, your username can only include alphanumeric ' +
        'characters and basic symbols. :frowning2:');
      return;
    }

    if (service.length === 0 || username.length === 0) {
      message.reply('You need to include both a service and a username ' +
          'when trying to save your info. Try using the command ' +
          'like this: ```!setinfo [service] [username]```');
      return;
    }

    let updates = {};

    updates['/users/info/' + message.author.id + '/' + service] = username;

    firebase.database().ref().update(updates);

    message.reply('I\'ve updated your info! :ok_hand: Use `!getinfo` to ' +
        'see the changes.');
  }
};
