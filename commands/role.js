const roles = require('../roles');

/**
 * Tries to case-insensitively find a role matching the input string.
 *
 * @param {any} guild The guild object to look for roles in
 * @param {any} roleName The suspected role name
 * @returns If a valid role, the role object.
 */
function findRole(guild, roleName) {
  for (const role of guild.roles.array()) {
    if (role.name.toLowerCase() === roleName.toLowerCase()) {
      return role;
    }
  }
}

function availableRoles(message) {

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

    // Exclude Mercy generated roles
    if (role.name.startsWith('Mercy-')) {
      return;
    }

    // Exclude @everyone
    if (role.name === '@everyone') {
      return;
    }

    if(roles.NITRO_ONLY_ROLES.includes(role.name)){
      availableRoles.push(`${role.name} (Only for ${roles.NITRO_ROLE})`);
    } else {
      availableRoles.push(role.name);
    }
  });

  return availableRoles.sort();
}


function usage(message) {
  const roles = availableRoles(message).join('\n');

  message.reply(
    'Usage: `!role ' + module.exports.usage + '`\n' +
    'Here are the roles you can manage:\n```\n' +
    roles +
    '```'
  );
}

function checkRestricted(role, restrictedSet) {
  const length = restrictedSet.length;
  for(var i = 0; i < length; i++) {
    if(restrictedSet[i].toLowerCase() == role.toLowerCase())
      return true;
  }
  return false;
}

module.exports = {
  usage: '[role]',
  description: 'Toggles on/off a role from yourself.',
  allowDM: false,
  onlyIn: ['bot-room'],
  process: (bot, message) => {
    let msg = message.content;

    // Some users mis-read the usage text and assume that they need to
    // surround the operator with square brackets. Let's just tolerate their
    // ignorance. (replace '[' or ']' with '')
    msg = msg.replace(/\[|\]/g, '');

    // Split the message into command arguments on spaces
    msg = msg.split(' ');

    // Check that we have at least '!role' and something else (hopefully a
    // valid operator, but we can also accept commands with no operators, more
    // on that later)
    if (msg.length < 2) {
      usage(message);
      return;
    }

    // Remove the first element, as it will be '!role'
    msg.shift();

    // Collapse parameters into a space-delimited string
    let roleName = msg.join(' ');

    // Perform a case-insensitive search for the role
    const targetRole = findRole(message.guild, roleName);

    // Make sure the role actually exists
    if (!targetRole) {
      message.reply('Sorry... That\'s not a role :sob:');
      usage(message);
      return;
    }

    const isRestricted = checkRestricted(roleName, roles.RESTRICTED_ROLES);
    if (isRestricted) {
      message.reply('Naughty naughty... :wink: You can\'t use that role!');
      return;
    }

    const isRegion = checkRestricted(roleName, roles.REGION_ROLES);
    if (isRegion) {
      message.reply('You can change your region using the `!setregion` command! :wink:');
      return;
    }


    // Check if they already have the role
    const hasRole = message.member.roles.findKey('id', targetRole.id);
    if (hasRole) {
      // Remove the role
      message.member.removeRole(targetRole)
        .then(
          () => {
            message.reply('I\'ve removed that role from you! :ok_hand:');
            return;
          },
          (rejectReason) => {
            // TODO: Reject handler
            console.error(rejectReason);
          })
        .catch((e) => {
          // TODO: Error handler
          console.error(e.stack);
        });
    } else {
      // Check if role is for nitro and nitro status of user
      if (checkRestricted(roleName, roles.NITRO_ONLY_ROLES) && !message.member.roles.findKey('id', findRole(message.guild, roles.NITRO_ROLE).id)){
        message.reply(`Naughty naughty... :wink: You can\'t use that role! It\'s only for ${roles.NITRO_ROLE}!`);
        return;
      }

      // Add the new role
      message.member.addRole(targetRole)
        .then(
          () => {
            message.reply('I\'ve added your new role! :ok_hand:');
            return;
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
  }
};
