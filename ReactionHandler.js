const Discord = require(`discord.js`);
const roles = require(`./roles`);
const START_TRESHOLD = 2;
const STARBOARD_ID = '770059932635889695';
const STARBOARD18_ID = '770059902311727116';

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

  async getRoleFromReaction(Reaction) {
    const roleKey = Reaction.emoji.id
      ? this.reactionRoles.get(Reaction.emoji.id)
      : this.reactionRoles.get(Reaction.emoji.name);

    if (!roleKey) return false;

    const Role = await Reaction.message.guild.roles.cache.find(
      (role) => role.name === roleKey
    );
    return Role;
  }

  handleReaction(Reaction, User, ...args) {
    if (process.env.DEV && Reaction.message.guild.id === `123315443208421377`) return;

    if (Reaction.me) return;

    if (Reaction.message.channel.name === `roles`) {
      this.handleRoleReaction(Reaction, User, args[0]);
      return;
    }
    else if (Reaction._emoji.name === '⭐' && Reaction.message.type === 'DEFAULT' && Reaction.message.author.bot === false) {
      // Is it the star emoji on a non-system, non-bot message, let's handle it
      this.handleStarReaction(Reaction, args[0]);
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

    if (!Member.roles.cache.findKey((role) => role.name === `Nitro Booster`) && roles.nitroOnly.includes(Role.name)) {
      if (type === `ADD`) {
        Reaction.users.remove(User);
      }
      return;
    }

    if (type === `ADD`) Member.roles.add(Role);
    if (type === `REMOVE`) Member.roles.remove(Role);
  }

  async handleStarReaction(Reaction) {
    await Reaction.fetch();
    
    // TODO: Any channels we don't want to count star reactions on (like Announcements, etc.)?
    // TODO: Do we want to use permissions to prevent emoji on starboard channels?
    
    if (Reaction.message.channel.name !== 'starboard' && Reaction.message.channel.name !== 'starboard-over-18'
        && Reaction.count >= START_TRESHOLD) {
      
      var starMessage = Reaction.message.author.toString() + ' [Everyone liked that]\nHere\'s the message: \n\n' + Reaction.message.content;
      
      if (Reaction.message.channel.parent != null && Reaction.message.channel.parent.name === 'Over 18') {
        // Is it probably a naughty message?
        Reaction.client.channels.fetch(STARBOARD18_ID)
        .then(channel => channel.send(starMessage))
        .catch(console.error);
      }
      else {
        // It's a message anyone should be able to see
        Reaction.client.channels.fetch(STARBOARD_ID)
        .then(channel => channel.send(starMessage))
        .catch(console.error);
      }
    }

    // TODO: Avoid posting the message a million times... perhaps ignore when over threshold?
    // TODO: ...and handle someone meeting threshold and quickly removing star (maybe)
    // TODO: A few magic strings here, const-ify probs

    return;
  }
}

module.exports = ReactionHandler;
