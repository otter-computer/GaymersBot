const strings = require('./strings.json');

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
      // Message.reply(strings.MISSING_COMMAND);
    }
  }

  help (Message) {

  }

  /**
   * Hug someone, or multiple people!
   * @param {Message} Message The Discord message object.
   */
  hug (Message) {
    let mentions = this.getMentionsFromMessage(Message);
    let userlist;

    if (mentions.size > 0) {
      userlist = mentions.array().join(', ');
    } else {
      userlist = Message.author;
    }
    
    const response = strings.HUG_RESPONSES[Math.floor(Math.random() * strings.HUG_RESPONSES.length)].replace('${user}', userlist);
    Message.channel.send(response);
  }
}

module.exports = CommandHandler;
