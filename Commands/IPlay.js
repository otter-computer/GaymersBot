const Command = require(`./Command.js`);
const Discord = require(`discord.js`);
const roles = require(`../roles.json`);

class IPlay extends Command {
  constructor() {
    super();
    this.name = `iplay`;
    this.aliases = [`role`, `roles`, `game`, `games`, `play`];
    this.description = `Tell us which games you play!  This will add a pingable role so you can find other people to play with.`;
    this.usage = ``;
    this.serverOnly = true;
    this.gameRoles = [];
    this.gameRolesLowerCase = [];
  }

  async execute(Message) {
    if (this.gameRoles.length === 0) this.updateRoles(Message);

    const args = Message.content.split(/ +/);
    args.shift();

    if (args.length === 0) {
      const content = `Here's a list of game roles you can add. These roles are pingable by anyone on the server. Add a role like this: \`!iplay World of Warcraft\``;
      const embed = new Discord.MessageEmbed();
      embed.setDescription(this.gameRoles.join(`\n`));
      Message.reply(content, {embed: embed, split: true});
      return;
    }

    if (args[0] === `refresh`) {
      Message.reply(`updating internal role list.`);
      this.updateRoles(Message);
      return;
    }

    const gameRoleName = args.join(` `);

    if (this.gameRolesLowerCase.includes(gameRoleName.toLowerCase())) {
      const Member = await Message.guild.members.fetch(Message.author.id);
      const Role = await Message.guild.roles.cache.find(role => role.name.toLowerCase() === gameRoleName.toLowerCase());

      if (!Role || !Member) return;

      if (Member.roles.cache.find(role => role.name.toLowerCase() === gameRoleName.toLowerCase())) {
        Member.roles.remove(Role);
        Message.reply(`I've removed the ${gameRoleName} role from you :ok_hand:`);
      } else {
        Member.roles.add(Role);
        Message.reply(`I've added the ${gameRoleName} role to you :ok_hand: Remember, this role is pingable by anyone on the server. To remove it, run this command again.`);
      }
    } else {
      const content = `sorry, there isn't a game role that matches that. Here's a list of game roles you can add. These roles are pingable by anyone on the server. Add a role like this: \`!iplay World of Warcraft\``;
      const embed = new Discord.MessageEmbed();
      embed.setDescription(this.gameRoles.join(`\n`));
      Message.reply(content, {embed: embed, split: true});
      return;
    }
  }

  updateRoles(Message) {
    const nonGameRoles = roles.nonGameRoles;
    const guildRoles = Message.guild.roles.cache.array();
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
  }
}

module.exports = IPlay;
