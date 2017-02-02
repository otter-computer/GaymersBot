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
    message.mentions.users.forEach(user => {
      const member = message.guild.member(user);
      let joined = moment(member.joinedAt);

      if (user.id === REYNBOW.id) {
        joined = REYNBOW.joinedAt;
      }

      const embed = new Discord.RichEmbed();

      embed.setColor(0x3398DB);
      embed.setTitle(member.displayName + ' joined ' + moment(joined).fromNow());

      if (user.id === REYNBOW.id) {
        embed.setTitle(member.displayName.toUpperCase() +
          ' BOUNCED IN HERE LIKE A FEISTY \'ROO ABOUT ' +
          moment(joined).fromNow().toUpperCase() + ', MATE.');
      }

      embed.addField('User', member);

      embed.setTimestamp(joined);

      message.channel.sendMessage('', { embed: embed });
    });
  }
};
