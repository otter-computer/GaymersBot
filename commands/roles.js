const roles = require('../roles');

module.exports = {
  usage: '',
  description: 'List roles that can be added using the !role command.',
  allowDM: false,
  onlyIn: ['bot-room'],
  process: (bot, message) => {
    const availableRoles = [];

    message.guild.roles.forEach(role => {
      // Exclude restricted roles
      if (roles.RESTRICTED_ROLES.includes(role.name)) {
        return;
      }

      // Exclude region roles
      if (roles.REGION_ROLES.includes(role.name)) {
        return;
      }

      // Exclude @everyone
      if (role.name === '@everyone') {
        return;
      }

      availableRoles.push(role.name);
    });

    message.reply('Here\'s the roles you can add:\n```' +
        availableRoles.join('\n') + '```');
  }
};
