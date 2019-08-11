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

    const embed = new Discord.RichEmbed();
    embed.setColor(0x3398DB);

    embed.setTitle(
      target.displayName +
      ' joined ' +
      moment(target.joinedAt).fromNow()
    );

    embed.setAuthor(
      target.displayName,
      target.user.avatarURL,
      ''
    );

    embed.addField('User:', target, true);
    embed.addField('Requested By:', message.author, true);
    embed.addField('Date:', target.joinedAt, true);

    message.channel.send(
      'Here\'s ' +
      target +
      '\'s joined date, requested by ' +
      message.author,
      { embed: embed }
    );
  }
};
