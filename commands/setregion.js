const REGIONS = require('../roles').REGION_ROLES;

module.exports = {
  usage: '[your region]',
  description: 'Set your region, get pretty color.',
  allowDM: false,
  process: (bot, message) => {
    let msg = message.content.split(' ');

    // Remove the first element, as it will be '!setregion'
    msg.shift();

    // Collapse parameters into a space-delimited string
    let regionName = msg.join(' ').toProperCase();

    // Some users mis-read the usage text and assume that they need to
    // surround the name with square brackets. Let's just tolerate their
    // ignorance. :(
    regionName = regionName.replace(/\[|\]/g, '');

    // If the user supplied a bad region name, give them the list
    if (!REGIONS.includes(regionName)) {
      message.reply('To set your region, type `!setregion ' +
          module.exports.usage + '`\nHere\'s the regions I can give you: ' +
          REGIONS.join(', '));
      return;
    }

    const newRegionRole = message.guild.roles.findKey('name', regionName);
    if (!newRegionRole) {
      // TODO: This means that the bot knows about a region that Discord
      // doesn't. :confused: The bot should call an admin if this happens.
      message.reply('Sorry, I had an issue setting your region. :confounded:');
      return;
    }

    // It's useless to set your region to its current value?
    if (message.member.roles.findKey('name', regionName)) {
      message.reply('You\'ve already set your region to that? :confused:');
      return;
    }

    // Remove any current region roles
    const rolesToRemove = [];
    REGIONS.forEach((region) => {
      const roleId = message.guild.roles.findKey('name', region);
      if (roleId) {
        rolesToRemove.push(roleId);
      } else {
        // FIXME: Warn about invalid region in list
      }
    });
    message.member.removeRoles(rolesToRemove)
      .catch((e) => {
        // TODO: Error handler
        console.error(e.stack);
      });

    // ...and give them the new one!
    message.member.addRole(newRegionRole)
      .then(
        () => {
          message.reply('I\'ve set your region! :white_check_mark::map:');
        },
        (rejectReason) => {
          // TODO: Reject handler
          console.error(rejectReason);
        })
      .catch((e) => {
        // TODO: Error handler
        console.error(e.stack);
      });
  }
};
