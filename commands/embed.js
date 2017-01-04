const Discord = require('discord.js');

module.exports = {
  usage: '',
  description: 'Test embeds',
  allowDM: true,
  process: (bot, message) => {

    console.log(message.attachments);

    let embed = new Discord.RichEmbed();

    embed.setColor(0xFF0000);
    // embed.setAuthor(message.member.displayName, message.author.displayAvatarURL);
    embed.setTitle('Message Deleted');
    embed.addField('User', message.author, true);
    embed.addField('Channel', message.channel, true);
    embed.addField('Content', message.content);

    embed.setImage('https://i.ytimg.com/vi/tntOCGkgt98/maxresdefault.jpg');

    let embedDate = new Date(Date.now());
    embed.setTimestamp(embedDate.toISOString());

    message.channel.sendMessage('', { embed: embed });
  }
};
