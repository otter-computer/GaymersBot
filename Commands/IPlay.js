const Command = require(`./Command.js`);
const Discord = require(`discord.js`);
const roles = require(`../roles.json`);

class IPlay extends Command {
  constructor() {
    super();
    this.name = `iplay`;
    this.aliases = [`role`, `roles`, `game`, `games`];
    this.description = `Tell us which games you play!  This will add a pingable role so you can find other people to play with.`;
    this.usage = ``;
    this.serverOnly = true;
  }

  execute(Message) {
    // TODO: List game roles
    // TODO: Apply game roles
  }
}

module.exports = IPlay;
