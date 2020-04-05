const fs = require('fs');
const Discord = require('discord.js');

class ReactionHandler {
  constructor() {

    // Dynamically load reaction actions
    this.actions = new Discord.Collection();

    const actionFiles = fs.readdirSync('./Actions');

    for (const file of actionFiles) {
      // Skip template class
      if (file === 'Action.js') continue;

      const action = require(`./Actions/${file}`);

      this.actions.set(action.name.toLowerCase(), new action());
    }
  }

  addRole(Role, Member) {

  }

  async getGuildMemberFromReaction(Reaction) {

  }

  async getRoleFromReaction (Reaction) {
    const Guild = Reaction.message.guild;


  }

  async handleReaction(Type, Reaction, User) {
    // Ignore if added by bot
    if (Reaction.me) return;

    // Ignore if not in #roles
    if (Reaction.message.channel.name !== 'roles') return;

    await Reaction.fetch();

    const Role = await this.getRoleFromReaction(Reaction);
    const Member = await this.getGuildMemberFromReaction(Reaction);

    switch (Type) {
      case 'ADD':
        this.addRole(Role, Member);
        break;
      case 'REMOVE':
        this.removeRole(Role, Member);
        break;
      default:
        break;
    }
  }

  removeRole(Role, Member) {

  }
}

module.exports = ReactionHandler;
