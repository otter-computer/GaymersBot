const fs = require('fs');
const Discord = require('discord.js');

class ReactionHandler {
  constructor() {

    // Dynamically load reaction actions
    this.actions = new Discord.Collection();

    const actionFiles = fs.readdirSync('./Actions');

    for (const file of actionFiles) {
      const action = require(`./Actions/${file}`);

      // Skip default Action class
      if (action.name === 'name') return;

      this.actions.set(action.name.toLowerCase(), new action());
    }
  }

  addRole(Role, Member) {

  }

  getRole(roleName, Guild) {

  }

  handleReaction(Type, Reaction, User) {
    // Ignore if not in #roles
    if (!this.isInRolesChannel(Reaction.message.channel.name)) return;

    const roleName = roles[Reaction.emoji.name] ? roles[Reaction.emoji.name] : null;

    // Ignore if reaction not in role list
    if (!roleName) return;

    const role = this.getRole(roleName, Reaction.message.guild);

    switch (Type) {
      case 'ADD':
        this.addRole(role, Reaction.member);
        break;
      case 'REMOVE':
          this.removeRole(role, Reaction.member);
        break;
      default:
        break;
    }
  }

  isInRolesChannel(channelName) {
    if (channelName == 'roles') {
      return true;
    } else {
      return false;
    }
  }

  removeRole(Role, Member) {

  }
}

module.exports = ReactionHandler;
