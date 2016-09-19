module.exports = {
  usage: '[your region]',
  description: 'Set your region, get pretty color.',
  process: (bot, message) => {
    // Error check so not in PM
    if (message.channel.type !== 'text') {
      message.reply('sorry... I can\'t set your region inside private messages.');
      return;
    }

    let msg = message.content.split(' ');

    let regionName = '';

    // Concat region with spaces
    for (let i = 1; i < msg.length; i++) {
      if (regionName.length > 1) regionName += ' ';

      regionName += msg[i].replace('[','').replace(']','').toProperCase();
    }

    // Check if region exists
    if (message.guild.roles.find('name', regionName)) {
      let region = message.guild.roles.find('name', regionName);
      let member = message.guild.member(message.author);
      let currentRoles = [];

      for (var [id, currentRole] of member.roles) {

        // Check if new region is already set on member
        if (currentRole === region) {
          message.reply('you\'ve already set your region to ' + region.name);
          return;
        }

        // Check for other region roles and ignore
        if (!currentRole.name.match(/^(North America|South America|Middle East|Oceania|Europe|Africa|Asia)$/gi)) {
          currentRoles.push(currentRole);
        }
      }

      // Add the new region to the array
      currentRoles.push(region);

      // Reapply the roles!
      member.setRoles(currentRoles);

      message.reply('I\'ve set your region to ' + regionName + ' :smile:');
    }
  }
};
