const Discord = require('discord.js');
const moment = require('moment');

module.exports = {
  usage: '[@user]',
  description: 'See when someone joined the server.',
  allowDM: false,
  process: (bot, message) => {
    let target = message.guild.member(message.mentions.users.first());
    if (!target) {
      target = message.member;
    }

    const spazerDate = new Date('2016-03-07');

    const embed = new Discord.RichEmbed();
    embed.setColor(0x3398DB);

    if (target.id === '120897878347481088') {
      embed.setTitle(
        `${target.displayName} joined ${moment(spazerDate).fromNow()}`
      );
    } else {
      embed.setTitle(
        target.displayName +
        ' joined ' +
        moment(target.joinedAt).fromNow()
      );
    }

    embed.setAuthor(
      target.displayName,
      target.user.avatarURL,
      ''
    );

    embed.addField('User:', target, true);
    embed.addField('Requested By:', message.author, true);

    if (target.id === '120897878347481088') {
      embed.addField('Date:', spazerDate, true);
    } else {
      embed.addField('Date:', target.joinedAt, true);
    }

    message.channel.send(
      'Here\'s ' +
      target +
      '\'s joined date, requested by ' +
      message.author,
      { embed: embed }
    );
  }
};
