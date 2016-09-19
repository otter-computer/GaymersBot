module.exports = {
  usage: '',
  description: 'Remove your region, remain mysterious.',
  process: (bot, message) => {
    // Error check so not in PM
    if (message.channel.type !== 'text') {
      message.reply('sorry... I can\'t remove your region inside private messages.');
      return;
    }

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
