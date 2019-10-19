const Discord = require('discord.js');
const moment = require('moment');

class CommandHandler {
  constructor(Bot) {
    this.Bot = Bot;
  }

  /**
   * Gets a user's avatar
   * @param {Message} Message The Discord message object
   */
  avatar(Message) {
    const mentions = this.getMentionsFromMessage(Message);
    let target;

    if (mentions.size > 0) {
      target = mentions.first();
    } else {
      target = Message.author;
    }

    if (target.avatarURL) {
      //Removes size parameter which breaks animated avatars hosting
      //Keep it in static avatars for higher quality
      const avatarURLParts = target.avatarURL.split('?');
      let avatarURL;
      
      if (avatarURLParts[0].slice(-3) == 'gif') {
        avatarURL = avatarURLParts[0];
      } else {
        avatarURL = target.avatarURL;
      }

      Message.reply(`Here's ${target.toString()}'s avatar: ${avatarURL}`);
    } else {
      Message.reply(`Sorry, I couldn't find an avatar for ${target} :sob:`);
    }
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
   * Fetches a mentioned target (or targets) from a message, or returns the Message author
   * @param {Message} Message The Discord message object
   */
  getMessageTarget(Message) {
    const mentions = this.getMentionsFromMessage(Message);

    if (mentions.size > 0) {
      return mentions.array().join(', ');
    } else {
      return Message.author;
    }
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

  hasPermission(Message) {
    // TODO
  }

  help(Message) {
    // TODO
  }

  /**
   * Hug someone, or multiple people!
   * @param {Message} Message The Discord message object.
   */
  hug(Message) {
    const target = this.getMessageTarget(Message);

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

  /**
   * Shows a member's join date
   * @param {Message} Message The Discord message object
   */
  joined(Message) {
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

  /**
   * Spray someone thirsty, or multiple people!
   * @param {Message} Message The Discord message object.
   */
  spray(Message) {
    const target = this.getMessageTarget(Message);

    const response = `*sprays ${target} with a fire hose.*`;
    const specialResponse = `*sprays ${target} with canned cheese.*`;

    if (Math.floor(Math.random() * 50) + 1 === 50) {
      Message.channel.send(specialResponse);
    } else {
      Message.channel.send(response);
    }
  }

  /**
   * Slap someone, or multiple people!
   * @param {Message} Message The Discord message object.
   */
  slap(Message) {
    const target = this.getMessageTarget(Message);

    const response = `*slaps ${target} around a bit with a large, girthy trout.* :fish:`;
    const specialResponse = `*slaps ${target} with a meaty sausage.*`;

    if (Math.floor(Math.random() * 50) + 1 === 50) {
      Message.channel.send(specialResponse);
    } else {
      Message.channel.send(response);
    }
  }
}

module.exports = CommandHandler;
