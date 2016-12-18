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

    const newRegionRole = message.guild.roles.find('name', regionName);
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

    // We need to rebuild the role list here because using removeRoles and
    // addRoles shortly after each other seems to not work. It looks like
    // role removal has no effect, even when put in removeRoles' .then()
    // Hopefully I'll be able to debug this in the future and we can return
    // to a simplified .removeRoles() .addRole() solution. JM
    const modifiedRoleList = [];
    message.member.roles.forEach(existingRole => {
      if (REGIONS.includes(existingRole.name)) {
        // Filter out any region roles
        return;
      }
      modifiedRoleList.push(existingRole);
    });
    modifiedRoleList.push(newRegionRole);

    message.member.setRoles(modifiedRoleList)
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
