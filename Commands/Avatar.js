const Command = require(`./Command.js`);
const Discord = require('discord.js');

class Avatar extends Command {
  constructor() {
    super();
    this.name = `avatar`;
    this.aliases = [`pic`, `pfp`, `icon`];
    this.description = `See a bigger version of someone's avatar—or your own! Add the \`private avatar\` role in #roles to stop this command being used on you.`;
    this.usage = `[@someone]`;
    this.serverOnly = true;
  }

  async execute(Message) {
    const targetUser = Message.mentions.users.size > 0 ? Message.mentions.users.first() : Message.author;
    const targetMember = await Message.guild.members.cache.get(targetUser.id);

    if (targetMember.roles.cache.findKey(role => role.name === `Private Avatar`)) {
      Message.reply(`${targetUser.toString()} has made their avatar private.`);
      return;
    }
    
    const embed = new Discord.MessageEmbed();
    
    embed.setImage(targetUser.displayAvatarURL({dynamic: true, size: 1024}));

    Message.reply(`here's ${targetUser.toString()}'s avatar:`, {embed: embed});
  }
}

module.exports = Avatar;
