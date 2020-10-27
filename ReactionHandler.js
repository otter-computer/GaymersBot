const Discord = require(`discord.js`);
const roles = require(`./roles`);
const starConfig = require(`./star-config`);

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
    else if (args[0] === 'ADD' && Reaction._emoji.name === '⭐' 
              && Reaction.message.type === 'DEFAULT' && Reaction.message.author.bot === false) {
      // Is it and added star emoji on a non-system, non-bot message? Let's handle it.
      this.handleStarReaction(Reaction);
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
    let starboardChannelId;

    if (!starConfig.ignoreChannels.includes(Reaction.message.channel.name)
        && Reaction.count === starConfig.starThreshold) {      
      // Message not in a black-listed channel and meets star threshold
      
      // Construct message to forward
      let starMessage = `${Reaction.message.author.toString()} [Everyone liked that]` 
                        + '\n' + `>>> ${Reaction.message.content}`;
      
      // TODO: Determine what we want the message to ultimately look like

      // Check if it should be posted on an over 18 starboard
      if (Reaction.message.channel.parent != null 
          && Reaction.message.channel.parent.name === starConfig.over18SectionName) {
        starboardChannelId = starConfig.starboardOver18Id;
      }
      else {
        starboardChannelId = starConfig.starboardId;
      }

      Reaction.client.channels.fetch(starboardChannelId)
        .then(channel => channel.send(starMessage))
        .catch(console.error);
    }

    // TODO: Avoid posting the message a million times... perhaps ignore when over threshold?
    // TODO: Handle case of someone meeting threshold and quickly removing star (maybe?)
    // TODO: A few magic strings here, const-ify probs...

    return;
  }
}

module.exports = ReactionHandler;
