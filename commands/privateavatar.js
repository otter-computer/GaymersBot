module.exports = {
  usage: '',
  description: 'Toggles between private and public avatar. Prevents the bot from showing your avatar if it is private.',
  allowDM: false,
  onlyIn: ['bot-room'],
  process: (bot, message) => {
    if (message.member.roles.findKey('name', 'Private Avatar')) {
      message.member.removeRole(message.member.roles.findKey('name', 'Private Avatar'))
        .then(
          () => {
            message.reply('I have set your avatar to **public** :smile:');
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
      message.member.addRole(message.guild.roles.findKey('name', 'Private Avatar'))
        .then(
          () => {
            message.reply('I have set your avatar to **private** :smile:');
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
