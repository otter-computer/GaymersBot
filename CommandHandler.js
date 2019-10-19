const Discord = require('discord.js');
const moment = require('moment');

class CommandHandler {
  constructor(Bot) {
    this.Bot = Bot;
  }

  /**
   * Fetches a collection of mentions from a message, excluding the bot itself
   * @param {Message} Message The Discord message object
   * @returns {Collection} Users A collection of Users
   */
  getMentionsFromMessage(Message) {
    return Message.mentions.users.filter(user => user.id !== this.Bot.client.user.id)
  }

  /**
   * Handles commands in incoming mesages, routing them to the correct function.
   * Handles cases of invocation via mention, or via the command prefix
   * @param {Message} Message The Discord message object
   */
  handleCommand(Message) {
    let command;

    // Handle cases where command is called using prefix
    if (Message.content.startsWith('!')) {
      command = Message.content.toLowerCase().split(' ')[0].substring(1);
    }

    // Handle cases where command is called using bot mention
    if (Message.mentions.users.has(this.Bot.client.user.id)) {
      const messageArgs = Message.content.toLowerCase().split(' ');

      if (messageArgs.length > 1) {
        command = messageArgs[1];
      } else {
        return;
      }
    }

    try {
      this[command](Message);
    } catch (error) {
      console.error('Command not found', error);
      // Message.reply(`Sorry, I couldn't find that command :frowning:`);
    }
  }

  help (Message) {
    // TODO
  }

  /**
   * Hug someone, or multiple people!
   * @param {Message} Message The Discord message object.
   */
  hug (Message) {
    const mentions = this.getMentionsFromMessage(Message);
    let target;

    if (mentions.size > 0) {
      target = mentions.array().join(', ');
    } else {
      target = Message.author;
    }

    const responses = [
      `*hugs ${target}*`,
      `*hugs ${target}*`,
      `*hugs ${target}*`,
      `*hugs ${target}*`,
      `*licks ${target}*`,
      `*pounces ${target}*`,
      `*jumps on ${target}*`,
      `*glomps ${target}*`,
      `*falls on ${target}*`,
      `*bear hugs ${target}*`,
      `*tightly squeezes ${target}*`,
      `*embraces ${target}*`,
      `*holds ${target} close*`,
      `*cuddles ${target}*`
    ]
    
    Message.channel.send(responses[Math.floor(Math.random() * responses.length)]);
  }

  joined (Message) {
    const mentions = this.getMentionsFromMessage(Message);
    let target;

    if (mentions.size > 0) {
      target = Message.guild.member(mentions.first())
    } else {
      target = Message.member;
    }

    const embed = new Discord.RichEmbed();
    embed.setColor(0x3398DB);
    embed.setAuthor(target.displayName, target.user.displayAvatarURL, '');
    embed.setTitle(`${target.displayName} joined ${moment(target.joinedAt).fromNow()}`);
    embed.setDescription(target.joinedAt);

    Message.reply(`Here's ${target.toString()}'s join date`, {embed: embed});
  }
}

module.exports = CommandHandler;
