const Command = require(`./Command.js`);
const Discord = require(`discord.js`);
const roles = require(`../roles.json`);

class IPlay extends Command {
  constructor() {
    super();
    this.name = `iplay`;
    this.aliases = [];
    this.description = `Tell us which games you play!`;
    this.usage = ``;
    this.serverOnly = true;
  }

  execute(Message) {
    
  }
}

module.exports = IPlay;
