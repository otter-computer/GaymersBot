const Command = require('./Command.js');
const Discord = require('discord.js');
const roles = require('../roles.js');

class Roles extends Command {
  constructor() {
    super();
    this.name = 'roles'
    this.aliases = ['role'],
    this.description = 'Add some roles'
    this.usage = '',
    this.serverOnly = true
  }

  execute(Message, ...args) {
    const embed = new Discord.RichEmbed();

    embed.setTitle(`Roles`)

    embed.setDescription(
      `What type of role would you like to add? Use reactions to select an option.`
    )

    embed.addField('Color','❤️', true)
    embed.addField('Region','🧡', true)
    embed.addField('Identity','💛', true)

    const reactionFilter = (reaction, user) => {
      return (reaction.emoji.name === '❤️' || reaction.emoji.name === '🧡' || reaction.emoji.name === '💛') && user.id === message.author.id;
    };

    Message.reply({embed: embed})
    .then(() => { Message.react('❤️') })
    .then(() => { Message.react('🧡') })
    .then(() => { Message.react('💛') })
    // .then(() => Message.awaitReactions(filter, { time: 15000 }))
  }
}

module.exports = Roles;
