const Discord = require('discord.js');
const moment = require('moment');

// For the special little snowflake...
const REYNBOW = {
  'id': '123395731548536832',
  'joinedAt': '2015-12-27T01:00:00Z'
};

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
    embed.addField('User', target);

    if (target.id === REYNBOW.id) {
      embed.setTitle(target.displayName.toUpperCase() +
        ' BOUNCED IN HERE LIKE A FEISTY \'ROO ABOUT ' +
        moment(REYNBOW.joinedAt).fromNow().toUpperCase() + ', MATE.');
      embed.setTimestamp(REYNBOW.joinedAt);
    } else {
      embed.setTitle(target.displayName + ' joined ' +
        moment(target.joinedAt).fromNow());
      embed.setTimestamp(target.joinedAt);
    }

    message.channel.sendMessage('', { embed: embed });
  }
};
