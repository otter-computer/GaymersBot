module.exports = {
  usage: '',
  description: 'Remove your region, remain mysterious.',
  allowDM: false,
  process: (bot, message) => {
    let member = message.guild.member(message.author);
    let currentRoles = [];

    for (var [id, currentRole] of member.roles) {

      // Check for region roles and ignore
      if (!currentRole.name.match(/^(North America|South America|Middle East|Oceania|Europe|Africa|Asia)$/gi)) {
        currentRoles.push(currentRole);
      }
    }

    // Reapply the roles!
    member.setRoles(currentRoles);

    message.reply('I\'ve removed your region :smile:');

  }
};
