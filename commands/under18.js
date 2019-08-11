module.exports = {
  usage: '[@user]',
  description: 'Add the \'Under 18\' role.',
  allowDM: false,
  requireRoles: ['Admin', 'Moderator'],
  process: (bot, message) => {

    if (!message.mentions.users.first()) {
      message.reply('Usage: !under18 ' + module.exports.usage);
      return;
    }

    const member = message.guild.member(message.mentions.users.first());
    const under18Role = message.guild.roles.find('name', 'Under 18');

    if (member.roles.exists('name', 'Under 18')) {
      member.removeRole(under18Role);
      message.reply('I have removed the `Under 18` role from the user. :ok_hand:');
    } else {
      member.addRole(under18Role);
      message.reply('I have given the `Under 18` role to the user. :ok_hand:');
    }
  }
};
