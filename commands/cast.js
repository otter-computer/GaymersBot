module.exports = {
  usage: '[spell]',
  description: 'Cast some magic spells',
  allowDM: false,
  requireRoles: ['Admin', 'Moderator'],
  process: (bot, message) => {
    const args = message.content.slice(1).split(/ +/);
    const spell = args[1].toLowerCase();

    if (spell === 'slowga') {
      const time = args[2];
      const rateLimit = time ? time : '10';
      message.channel.setRateLimitPerUser(rateLimit);
    }
  }
};
