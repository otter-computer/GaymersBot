const fs = require(`fs`);
const Discord = require(`discord.js`);
const roles = require(`./roles`);

class ReactionHandler {
  constructor() {
    this.reactionRoles = new Discord.Collection();

    for (const role in roles.reactions) {
      this.reactionRoles.set(role, roles.reactions[role]);
    }
  }

  addRole(Role, Member) {
    // TODO: Handle case where role is already added.
  }

  async getGuildMemberFromReaction(Reaction, User) {
    Reaction.message.guild.members.fetch(User.id).then(member => {
      return member;
    });
  }

  async getRoleFromReaction (Reaction) {
    const roleName = Reaction.emoji.id ? this.reactionRoles.get(Reaction.emoji.id) : this.reactionRoles.get(Reaction.emoji.name);

    if (!roleName) return false;

    return Reaction.message.guild.roles.cache.find(role => role.name === roleName);
  }

  async handleReaction(type, Reaction, User) {
    if (Reaction.message.channel.name !== `roles`) return;
    if (Reaction.me) return;

    await Reaction.fetch();

    const Role = await this.getRoleFromReaction(Reaction);
    const Member = await this.getGuildMemberFromReaction(Reaction, User);

    if (type === `ADD` && (!Role || !Member)) Reaction.users.remove(User);

    if (type === `ADD`) this.addRole(Role, Member); 
    if (type === `REMOVE`) this.removeRole(Role, Member);
  }

  removeRole(Role, Member) {
    // TODO: Handle case where role is already removed.
  }
}

module.exports = ReactionHandler;
