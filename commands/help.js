const commands = require('./index');
const utils = require('../utils/discordHelpers');

module.exports = {
  usage: '',
  description: 'See what commands I can run!',
  allowDM: true,
  process: (bot, message) => {

    const userCommands = utils.generateCommandSet(false);
    const member = bot.guilds.first().members.get(message.author.id);

    for (let i = 0; i < userCommands.length; i++) {
      message.author.send(userCommands[i]).catch(error => {
        console.error('Couldn\'t send DM' , error);
      });
    }

    if (member.roles.exists('name','Moderator') && !member.roles.exists('name','Admin')) {

      const modCommands = utils.generateCommandSet('Moderator');
      for (let i = 0; i < modCommands.length; i++) {
        message.author.send(modCommands[i]).catch(error => {
          console.error('Couldn\'t send DM' , error);
        });
      }
    }

    if (member.roles.exists('name','Admin')) {
      const adminCommands = utils.generateCommandSet('Admin');
      for (let i = 0; i < adminCommands.length; i++) {
        message.author.send(adminCommands[i]).catch(error => {
          console.error('Couldn\'t send DM' , error);
        });
      }
    }

    // If !help was run in a public channel, send a message to that channel too
    if (message.channel.type === 'text') {
      message.reply('Check your DMs :wink:');
    }
  }
};
