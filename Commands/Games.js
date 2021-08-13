const Command = require(`./Command.js`);
const roles = require(`../roles.json`);

class Games extends Command {
  constructor() {
    super();
    this.name = `games`;
    this.description = `Add a pingable game role to yourself to be notified when others want to play`;
    this.types = [`CHAT_INPUT`];
    this.options = [{
      name: `game`,
      type: `STRING`,
      description: `The game role you want to add`,
      required: false
    }];

    this.gameRoles = [];
    this.gameRolesLowerCase = [];
    this.gameRoleList = ``;
  }

  async execute(Interaction) {
    if (this.gameRoles.length === 0) this.updateRoles(Interaction);

    const game = Interaction.options.get(`game`);

    if (!game) {
      const content = `Here's a list of game roles you can add. These roles are pingable by anyone on the server.${this.gameRoleList}`;
      Interaction.reply({ content: content, ephemeral: true });
      return;
    }

    if (game.value === `refresh`) {
      Interaction.reply({ content: `Updating internal role list. :robot:`, ephemeral: true });
      this.updateRoles(Interaction);
      return;
    }

    if (this.gameRolesLowerCase.includes(game.value.toLowerCase())) {
      const Member = await Interaction.member;
      const Role = await Interaction.guild.roles.cache.find(role => role.name.toLowerCase() === game.value.toLowerCase());

      if (!Role || !Member) return;

      if (Member.roles.cache.find(role => role.name.toLowerCase() === game.value.toLowerCase())) {
        Member.roles.remove(Role);
        Interaction.reply({ content: `I've removed the ${game.value} role from you :ok_hand:`, ephemeral: true });
      } else {
        Member.roles.add(Role);
        Interaction.reply({ content: `I've added the ${game.value} role to you :ok_hand: Remember, this role is pingable by anyone on the server. To remove it, run this command again.`, ephemeral: true });
      }
    } else {
      const content = `Sorry, there isn't a game role that matches that. Here's a list of game roles you can add. These roles are pingable by anyone on the server.${this.gameRoleList}`;
      Interaction.reply({ content: content, ephemeral: true });
      return;
    }
  }

  updateRoles(Interaction) {
    const nonGameRoles = roles.nonGameRoles;
    const guildRoles = Array.from(Interaction.guild.roles.cache.values());
    const gameRoles = [];
    const gameRolesLowerCase = [];

    for (const role of guildRoles) {
      if (nonGameRoles.includes(role.name)) continue;
      if (role.name === `@everyone`) continue;
      gameRoles.push(role.name);
      gameRolesLowerCase.push(role.name.toLowerCase());
    }

    gameRoles.sort();
    gameRolesLowerCase.sort();

    this.gameRoles = gameRoles;
    this.gameRolesLowerCase = gameRolesLowerCase;
    this.gameRoleList = `\n> ${this.gameRoles.join(`\n> `)}`;
  }
}

module.exports = Games;
