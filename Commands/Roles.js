const Command = require('./Command.js');
const Discord = require('discord.js');
const roles = require('../roles.js');

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

    // No roles selected, open role menu
    const embed = new Discord.RichEmbed();

    embed.setTitle(`Roles`)

    embed.setDescription(
      `What type of role would you like to add? Use reactions to select an option.`
    )

    embed.addField('Color', '🌈', true)
    embed.addField('Region','🗺', true)
    embed.addField('Identity','🏳️‍🌈', true)
    embed.addField('Games','🎮', true)

    const reactionFilter = (reaction, user) => {
      return user.id === Message.author.id;
    };

    Message.reply({embed: embed})

    // Set up collector to listen for reaction response
    .then(async BotMessage => {
      await BotMessage.react('🌈');
      await BotMessage.react('🗺');
      await BotMessage.react('🏳️‍🌈');
      await BotMessage.react('🎮');

      const collector = BotMessage.createReactionCollector(reactionFilter, { max: 1, time: 300000 });

      collector.on('collect', (reaction, collector) => {
        switch (reaction.emoji.name) {
          case '🌈':
            this.openColorMenu(Message, BotMessage);
            break;

          default:
            break;
        }
      })
    })
  }

  openColorMenu (Message, BotMessage) {

  }
}

module.exports = Roles;
