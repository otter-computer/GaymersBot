const Command = require(`./Command.js`);
const Discord = require('discord.js');
const moment = require('moment');

class Joined extends Command {
  constructor() {
    super();
    this.name = `joined`;
    this.aliases = [`joindate`];
    this.description = `See when someone joined the server`;
    this.usage = `@someone`;
    this.serverOnly = true;
  }

  execute(Message) {
    const target = Message.mentions.members.first() ? Message.mentions.members.first() : Message.member;
    const date = target.id === `120897878347481088` ? new Date(`2016-03-07`) : target.joinedAt;

    const embed = new Discord.MessageEmbed();
    embed.setColor(0x3398DB);

    embed.setTitle(`${target.displayName} joined ${moment(date).fromNow()}`);
    embed.addField(`Date:`, date, true);
    embed.setTimestamp(date);

    Message.reply(`here's ${target}'s joined date.`, {embed: embed});
  }
}

module.exports = Joined;
