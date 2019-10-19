class CommandHandler {
  constructor(Bot) {
    this.Bot = Bot;
  }

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
        Message.reply('Hello!');
        return;
      }
    }

    try {
      this[command](Message);
    } catch (error) {
      console.error('No command found!', error);
      Message.reply('Sorry, I couldn\'t find that command :frowning:');
    }
  }

  /**
   * Hug someone
   * @param {Message} Message The Discord message object.
   */
  hug (Message) {
    Message.reply('Hug.');
  }
}

module.exports = CommandHandler;
