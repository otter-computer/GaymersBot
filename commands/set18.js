module.exports = {
  usage: '',
  description: 'Gives you the 18+ role, allows access to #over-18 ' +
  'and #over-18-text.',
  allowDM: false,
  onlyIn: ['bot-room'],
  process: (bot, message) => {
    if (message.member.roles.findKey('name', 'Under 18')) {
      message.reply('You\'re under 18. I can\'t add the 18+ role. :frowning: ');
      return;
    }

    if (message.member.roles.findKey('name', '18+')) {
      message.reply('You already have 18+ set? :confused:');
      return;
    }

    message.member.addRole(message.guild.roles.findKey('name', '18+'))
      .then(
        () => {
          message.reply('I\'ve set you to 18+ :eggplant::peach:');
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
