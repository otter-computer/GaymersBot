const Discord = require('discord.js');

class MessageHandler {
  constructor(Bot) {
    this.Bot = Bot;
  }

  /**
   * Handles understanding an incoming message.
   * @param {Message} Message The Discord message object
   */
  handleMessage(Message) {
    // Ignore system, bot messages
    if (Message.system || Message.author.bot) {
      return;
    }

    // Ignore if not command
    if (!(this.startsWithPrefix(Message))) {
      return;
    }

    // If not in a text channel, reply bot is not available
    if (!(Message.channel instanceof Discord.TextChannel)) {
      Message.reply('Sorry, I can\'t be used in DMs. Try your message again in #bot-room in Gaymers');
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
}

module.exports = MessageHandler;
