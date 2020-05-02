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
    this.gameRoles = [];
  }

  execute(Message) {
    if (this.gameRoles.length === 0) this.updateRoles(Message);

    // TODO: add refresh command
    // TODO: Add/remove chosen role
  }

  updateRoles(Message) {
    const nonGameRoles = roles.nonGameRoles;
    const guildRoles = Message.guild.roles.cache.array();
    const gameRoles = [];

    for (const role of guildRoles) {
      if (nonGameRoles.includes(role.name)) continue;
      if (role.name === `@everyone`) continue;
      gameRoles.push(role.name);
    }

    gameRoles.sort();

    this.gameRoles = gameRoles;
  }
}

module.exports = IPlay;
