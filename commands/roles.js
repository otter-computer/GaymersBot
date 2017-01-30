const roles = require('../roles');

module.exports = {
  usage: '',
  description: 'List roles that can be added using the !role command.',
  allowDM: false,
  onlyIn: ['bot-room'],
  process: (bot, message) => {
    const guild = bot.guilds.first();
    const serverRoles = guild.roles;

    let availableRoles = [];

    ServerRoleLoop:
    for (let [id, role] of serverRoles) {
      // Filter restricted roles
      for (let restrictedRole of roles.RESTRICTED_ROLES) {
        if (role.name == restrictedRole) {
          continue ServerRoleLoop;
        }
      }

      // Filter region roles
      for (let restrictedRole of roles.REGION_ROLES) {
        if (role.name == restrictedRole) {
          continue ServerRoleLoop;
        }
      }

      // Filter @everyone
      if (role.name === '@everyone') {
        continue ServerRoleLoop;
      }

      availableRoles.push(role);
    }

    let response = 'Here\'s the roles you can add:\n```';

    for (let role of availableRoles) {
      response += role.name + '\n';
    }

    response += '```';

    message.reply(response);
  }
};
