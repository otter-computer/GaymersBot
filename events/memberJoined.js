const Discord = require('discord.js');

module.exports = {
  process: (bot, member) => {
    const userLogsChannel = member.guild.channels.find('name', 'user-logs');
    const welcomeChannel = member.guild.channels.find('name', 'welcome-room');

    // Log the user joining to #user-logs
    if (!userLogsChannel) {
      console.error('Channel #user-logs doesn\'t exist!');
    } else {
      const embed = new Discord.RichEmbed();

      embed.setColor(0x3398DB);
      embed.setTitle('User Joined');
      embed.addField('User', member);

      const embedDate = new Date(Date.now()).toISOString();
      embed.setTimestamp(embedDate);

      userLogsChannel.sendMessage('', { embed: embed });
    }

    // Add a little message to #welcome-room to grab the user's attention
    if (!welcomeChannel) {
      console.error('Channel #welcome-room doesn\'t exist!');
    } else {
      welcomeChannel.sendMessage('Welcome to Gaymers, ' + member + '! ' +
          'Please introduce yourself, and check your DMs for more info! ' +
          'You will have access to other channels once you introduce ' +
          'yourself :smile:');
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
      'profile so you have an easier time finding folks to play with!\n\n' +
      'You will be given access to the other channels after you introduce ' +
      'yourself.'
    );
  }
};
