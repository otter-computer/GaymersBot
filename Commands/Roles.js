const Command = require(`./Command.js`);
const Discord = require(`discord.js`);
const roles = require(`../roles.json`);

class Roles extends Command {
  constructor() {
    super();
    this.name = `roles`;
    this.aliases = [`role`, `tags`, `color`, `colors`, `colour`, `colours`, `region`, `regions`];
    this.description = `Add some roles`;
    this.usage = ``;
    this.serverOnly = true;
  }

  execute(Message) {
    
  }
}

module.exports = Roles;
