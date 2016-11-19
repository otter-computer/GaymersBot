// Region names that correspond with Discord roles
const REGIONS = ['Africa', 'Asia', 'Europe', 'Middle East', 'Oceania',
                 'North America', 'South America']

module.exports = {
  usage: '[your region]',
  description: 'Set your region, get pretty color.',
  process: (bot, message) => {
    // This command doesn't make sense in a DM
    if (message.channel.type !== 'text') {
      message.reply('Sorry... I can\'t set your region in a DM.');
      return;
    }

    let msg = message.content.split(' ');

    // Remove the first element, as it will be '!setregion'
    msg.shift();

    // Collapse parameters into a space-delimited string
    let regionName = msg.join(' ').toProperCase();

    // Some users mis-read the usage text and assume that they need to
    // surround the name with square brackets. Let's just tolerate their
    // ignorance. :(
    regionName = regionName.replace('[', '').replace(']', '');

    if (!REGIONS.includes(regionName)) {
      message.reply('To set your region, type `!setregion ' +
          module.exports.usage + '`\nHere\'s the regions I can give you: ' +
          REGIONS.join(', '));
      return;
    }

    if (!message.guild.roles.find('name', regionName)) {
      // TODO: This means that the bot knows about a region that Discord
      // doesn't. :confused: The bot should call an admin if this happens.
      message.reply('Sorry, I had an issue setting your region. :confounded:');
      return;
    }

    let region = message.guild.roles.find('name', regionName);
    let member = message.guild.member(message.author);
    let newRoles = [];

    // Rebuild the user's role list into newRoles
    for (var [id, role] of member.roles) {
      // The user already has the 'new' role
      if (role === region) {
        message.reply('You\'ve already set your region to ' + region.name +
            '? :confused:');
        return;
      }

      // Exclude any region roles
      if (REGIONS.includes(role.name)) {
        continue;
      }

      newRoles.push(role);
    }

    // Add the new role
    newRoles.push(region);

    // ...and apply!
    member.setRoles(newRoles);

    message.reply('I\'ve set your region to ' + region.name + ' :smile:');
  }
};
