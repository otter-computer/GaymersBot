const moment = require('moment');
const format = require('../momentFormat');

module.exports = {
  process: (bot, guild, member) => {
    const userLogsChannel = guild.channels.find('name', 'user-logs');
    const welcomeChannel = guild.channels.find('name', 'welcome-room');

    // Log the user joining to #user-logs
    if (!userLogsChannel) {
      console.error('Channel #user-logs doesn\'t exist!');
    } else {
      userLogsChannel.sendMessage(
        member + ' joined the server. ' +
        '(' + moment(Date.now()).format(format) + ')'
      );
    }

    // Add a little message to #welcome-room to grab the user's attention
    if (!welcomeChannel) {
      console.error('Channel #welcome-room doesn\'t exist!');
    } else {
      welcomeChannel.sendMessage('Welcome to Gaymers, ' + member + '! ' +
          'Please introduce yourself, and check your DMs for more info!');
    }

    // DM the user more onboarding information
    member.sendMessage(
      '__**Welcome to Gaymers!**__\n\n' +
      'Please introduce yourself in **#welcome-room**, and feel free to ' +
      'tell us about your favorite games, where you\'re from, how you heard ' +
      'about the server, and anything else about yourself you\'d like to ' +
      'share.\n\n' +
      'We have region-based tags to help you find local gaming friends, and ' +
      'some special tags for members who like Overwatch, Battlefield, ' +
      'League of Legends and more. We are happy to add them to your ' +
      'profile so you have an easier time finding folks to play with!'
    );
  }
};
