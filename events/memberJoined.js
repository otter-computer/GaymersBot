const Discord = require('discord.js');

module.exports = {
  process: (bot, GuildMember) => {
    const User = GuildMember.user;
    const userLogsChannel = GuildMember.guild.channels.find('name', 'user-logs');

    userLogsChannel.send(
      ':white_check_mark: ' +
      User.toString() + ' ' +
      '(' + User.username + ') ' +
      '`' + User.id + '` joined at ' +
      new Date().toUTCString()
    );

    // DM the user more onboarding information
    const embed = new Discord.RichEmbed();

    const description = 'Thanks for joining us!\n\n' +
      'Make sure you read over our rules in the `#info-rules` channel. If you have any questions or concerns feel free to ping `@Admin` or `@Moderator`, or message a staff member directly.\n\n' +
      'We have region-based roles that give your name a color. To add one, type `!setregion North America` in the `#bot-room`.\n\n' +
      'We also have game roles to help you find people to play with. To find out what games we have, and how to add one to yourself, type `!role` in the `#bot-room`.\n\n' +
      'To find our other commands, type `!help` in the `#bot-room`.';

    embed.setTitle('Welcome to Gaymers!');
    embed.setDescription(description);
    embed.setFooter('Gaymers.GG', GuildMember.guild.iconURL);

    // GuildMember.send({ embed: embed });
  }
};
