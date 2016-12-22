module.exports = {
  usage: '[@user]',
  description: 'BOT DEVELOPER ONLY: Shows the latest deploy from GitHub.',
  allowDM: false,
  requireRoles: ['Bot Developer'],
  process: (bot, message) => {
    message.reply(
      'Bot deployed at: `' + process.env.HEROKU_RELEASE_CREATED_AT + '`\n' +
      'https://github.com/gaymers-discord/DiscoBot/commit/' + process.env.HEROKU_SLUG_COMMIT + '\n' +
      process.env.HEROKU_SLUG_DESCRIPTION
    );
  }
};
