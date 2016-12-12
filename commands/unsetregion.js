const REGION_ROLES = require('../roles').REGION_ROLES;

module.exports = {
  usage: '',
  description: 'Remove your region, remain mysterious.',
  allowDM: false,
  process: (bot, message) => {
    // Assemble a list of role IDs to give the removeRoles function, this
    // does all of the removal in one shot.
    const rolesToRemove = [];
    REGION_ROLES.forEach((region) => {
      const roleId = message.guild.roles.findKey('name', region);
      if (roleId) {
        rolesToRemove.push(roleId);
      } else {
        // FIXME: Warn about invalid region in list
      }
    });
    message.member.removeRoles(rolesToRemove)
      .then(
        () => {
          message.reply('I\'ve removed your region :no_entry_sign::map:');
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
