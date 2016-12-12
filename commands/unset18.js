module.exports = {
  usage: '',
  description: 'Removes the 18+ role.',
  allowDM: false,
  process: (bot, message) => {
    if (!message.member.roles.findKey('name', '18+')) {
      message.reply('You\'re not set as 18+? :confused:');
      return;
    }

    message.member.removeRole(message.guild.roles.findKey('name', '18+'))
      .then(
        () => {
          message.reply('I\'ve removed your 18+ status' +
          ':no_entry_sign::eggplant::peach:');
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
