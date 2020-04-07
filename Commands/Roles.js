const Command = require('./Command.js');
const Discord = require('discord.js');
const roles = require('../roles.json');

class Roles extends Command {
  constructor() {
    super();
    this.name = 'roles';
    this.aliases = ['role', 'tags', 'color', 'colors', 'colour', 'colours', 'region', 'regions'];
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

    this.openMainMenu(Message);
  }

  openMainMenu(Message, BotMessage) {
    const menu = [
      { name: 'Color', description: 'Give yourself a name color', emoji: '🌈', function: 'openColorMenu' },
      { name: 'Region', description: 'Let everyone know what region you\'re in', emoji: '🗺', function: 'openRegionMenu' },
      { name: 'Identity', description: 'Pronouns, sexuality, gender, etc', emoji: '🧬', function: 'openIdentityMenu' },
      { name: 'Platforms', description: 'Set which platforms you play on', emoji: '🖥', function: 'openPlatformsMenu' },
      { name: 'Games', description: 'Set which games you play', emoji: '🎮', function: 'openGamesMenu' },
      { name: 'Server', description: 'Add roles to change server settings', emoji: '🏳️‍🌈', function: 'openServerMenu' }
    ]

    // No roles selected, open role menu
    const embed = new Discord.MessageEmbed();

    embed.setTitle(`Roles`);

    for (const item of menu) {
      embed.addField(`${item.emoji} ${item.name}`, item.description, true);
    }

    const reactionFilter = (reaction, user) => {
      return user.id === Message.author.id;
    };

    // TODO: Handle message that already exists
    Message.reply({embed: embed})

    // Set up collector to listen for reaction response
    .then(async BotMessage => {
      const collector = BotMessage.createReactionCollector(reactionFilter, { max: 1, time: 300000 });

      collector.on('collect', (reaction, collector) => {
        const selection = menu.find(item => item.emoji === reaction.emoji.name);
        this[selection.function]();
      })

      for (const item of menu) {
        await BotMessage.react(item.emoji);
      }
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
