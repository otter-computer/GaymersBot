const Command = require('./Command.js');
const Discord = require('discord.js');
// const roles = require('../roles.js');

class Roles extends Command {
  constructor() {
    super();
    this.name = 'roles';
    this.aliases = ['role'];
    this.description = 'Add some roles';
    this.usage = '';
    this.serverOnly = true;
  }

  execute(Message, ...args) {
    // Handle specific roles
    if (!args) {
      // TODO
      return;
    }

    const menu = [
      { name: 'Color', description: 'Give yourself a name color', emoji: '🌈' },
      { name: 'Region', description: 'Let everyone know what region you\'re in', emoji: '🗺' },
      { name: 'Identity', description: 'Pronouns, sexuality, gender, etc', emoji: '🧬' },
      { name: 'Platforms', description: 'Set which platforms you play on', emoji: '🖥' },
      { name: 'Games', description: 'Set which games you play', emoji: '🎮' },
      { name: 'Server', description: 'Add roles to change server settings', emoji: '🏳️‍🌈' }
    ]

    // No roles selected, open role menu
    const embed = new Discord.RichEmbed();

    embed.setTitle(`Roles`);

    menu.forEach(item => {
      embed.addField(`${item.emoji} ${item.name}`, item.description, true);
    });

    const reactionFilter = (reaction, user) => {
      return user.id === Message.author.id;
    };

    Message.reply({embed: embed})

    // Set up collector to listen for reaction response
    .then(BotMessage => {

      menu.forEach(async item => {
        await BotMessage.react(item.emoji);
      })

      const collector = BotMessage.createReactionCollector(reactionFilter, { max: 1, time: 300000 });

      collector.on('collect', (reaction, collector) => {
        // TODO: Handle collection
      })
    })
  }

  openColorMenu (Message, BotMessage) {
    console.log('Open color menu');
  }

  openRegionMenu (Message, BotMessage) {
    console.log('Open region menu');
  }

  openIdentityMenu (Message, BotMessage) {
    console.log('Open identity menu');
  }

  openPlatformsMenu (Message, BotMessage) {
    console.log('Open platforms menu');
  }

  openGamesMenu (Message, BotMessage) {
    console.log('Open games menu');
  }

  openServerMenu (Message, BotMessage) {
    console.log('Open server menu');
  }
}

module.exports = Roles;
