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

  getRole (Reaction) {

  }

  async handleReaction(Type, Reaction, User) {
    // Ignore if not in #roles
    if (Reaction.message.channel.name !== 'roles') return;

    let FullReaction;

    console.log(Reaction);

    // TODO: Handle partial
    if (Reaction.partial) {
      FullReaction = await Reaction.fetch();
    } else {
      FullReaction = Reaction;
    }

    console.log(FullReaction);

    switch (Type) {
      case 'ADD':
        // this.addRole(role, FullReaction.member);
        break;
      case 'REMOVE':
        // this.removeRole(role, FullReaction.member);
        break;
      default:
        break;
    }
  }

  removeRole(Role, Member) {

  }
}

module.exports = ReactionHandler;
