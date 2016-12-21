module.exports = {
  usage: '[@user]',
  description: 'BOT DEVELOPER ONLY: Shows the latest deploy from GitHub.',
  allowDM: false,
  requireRoles: ['Bot Developer'],
  process: (bot, message) => {
    if (!process.env.HEROKU_APP_VERSION) {
      message.reply("Sorry, I couldn't get the latest deploy information. :sob:");
      return;
    }

    let commits = JSON.parse(process.env.HEROKU_APP_VERSION);

    let latest = Object.keys(commits)[commits.length - 1];

    message.reply(latest);
  }
};
