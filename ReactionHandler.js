const Discord = require(`discord.js`);
const roles = require(`./roles`);

class ReactionHandler {
  constructor() {
    this.reactionRoles = new Discord.Collection();

    for (const section in roles.reactions) {
      for (const roleEmoji in roles.reactions[section]) {
        this.reactionRoles.set(roleEmoji, roles.reactions[section][roleEmoji]);
      } 
    }
  }

  async getGuildMemberFromReaction(Reaction, User) {
    const Member = await Reaction.message.guild.members.fetch(User.id);
    return Member;
  }

  async getRoleFromReaction (Reaction) {
    const roleKey = Reaction.emoji.id ? this.reactionRoles.get(Reaction.emoji.id) : this.reactionRoles.get(Reaction.emoji.name);

    if (!roleKey) return false;

    const Role = await Reaction.message.guild.roles.cache.find(role => role.name === roleKey);
    return Role;
  }

  handleReaction(Reaction, User, ...args) {
    if(process.env.DEV && Reaction.message.guild.id === `123315443208421377`) return;

    if (Reaction.me) return;

    if (Reaction.message.channel.name === `roles`) {
      this.handleRoleReaction(Reaction, User, args[0]);
      return;
    }
  }

  async handleRoleReaction(Reaction, User, type) {
    await Reaction.fetch();

    const Role = await this.getRoleFromReaction(Reaction);
    const Member = await this.getGuildMemberFromReaction(Reaction, User);

    if (!Role || !Member) {
      if (type === `ADD`) {
        Reaction.users.remove(User);
      }
      return;
    }

    const memberUnder18Role = Member.roles.cache.filter(role => role.name === `Under 18`);
    if (memberUnder18Role.size > 0 && Role.name === `18+`) {
      if (type === `ADD`) {
        Reaction.users.remove(User);
      }
      return;
    }

    if (type === `ADD`) Member.roles.add(Role);
    if (type === `REMOVE`) Member.roles.remove(Role);
  }
}

module.exports = ReactionHandler;
