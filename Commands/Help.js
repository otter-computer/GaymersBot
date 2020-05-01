const Command = require(`./Command.js`);

class Help extends Command {
  constructor() {
    super();
    this.name = `help`;
    this.aliases = [`commands`];
    this.description = `How to use the bot!`;
    this.usage = ``;
    this.serverOnly = true;
  }

  execute(Message) {
    // TODO: Help command
  }
}

module.exports = Help;
