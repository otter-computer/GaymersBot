const Discord = require('discord.js');

class MessageHandler {
  constructor() {}

  /**
   * Handles understanding an incoming message.
   * @param {Message} Message The Discord message object
   */
  handleMessage(Message) {
    // Ignore system, bot messages
    if (Message.system || Message.author.bot) {
      return;
    }

    // If not in a text channel, reply bot is not available
    if (!(Message.channel instanceof Discord.TextChannel)) {
      this.replyToDm(Message);
      return;
    }

    // Ignore if not command
    if (!(this.startsWithPrefix(Message))) {
      return;
    }

    Message.reply('pong');
  }

  /**
   * Checks if the message starts with the command prefix
   * @param {Message} Message The Discord message
   */
  startsWithPrefix(Message) {
    if (Message.content.startsWith('!')) {
      return true;
    } else {
      return false;
    }
  }

  /**
   * Replies to a DM to the bot.
   * @param {Message} Message The Discord message
   */
  replyToDm(Message) {
    Message.reply('Bot can\'t be used in DMs.');
    return;
  }
}

module.exports = MessageHandler;
