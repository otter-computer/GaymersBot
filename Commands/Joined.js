const Command = require(`./Command.js`);

class Joined extends Command {
  constructor() {
    super();
    this.name = `joined`;
    this.aliases = [`joindate`];
    this.description = `See when someone joined the server`;
    this.usage = `@someone`;
    this.serverOnly = true;
  }

  execute(Message) {
    // TODO: this
  }
}

module.exports = Joined;
