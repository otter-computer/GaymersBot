const roles = require('./roles.json');

class ReactionHandler {
  constructor(Bot) {
    this.Bot = Bot;
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
