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
    let isAlreadyOnStarboard = false;

    if (!starConfig.ignoreChannels.includes(Reaction.message.channel.name)
          && Reaction.count === starConfig.starThreshold) {      
      // Message not in a black-listed channel and meets star threshold
      
      // Construct the starboard message
      const starMessage = new Discord.MessageEmbed()
          .setColor(`#d74894`)
          .setAuthor(`${Reaction.message.author.username}, your message belongs on the starboard!`, 
                     Reaction.message.author.displayAvatarURL())
          .setDescription(`${Reaction.message.content}`)
          .addField(`You're a ⭐ !`, `[Original message](https://discord.com/channels/${Reaction.message.guild.id}/${Reaction.message.channel.id}/${Reaction.message.id})`)
          .setImage(Reaction.message.attachments.size === 0 ? `` : Reaction.message.attachments.values().next().value.url)
          .setTimestamp()
          .setFooter(Reaction.message.id, Reaction.client.user.displayAvatarURL())

      // Check if it should be posted on an over 18 starboard
      if (Reaction.message.channel.parent != null 
            && Reaction.message.channel.parent.name === starConfig.over18SectionName) {
        starboardChannelId = starConfig.starboardOver18Id;
      }
      else {
        starboardChannelId = starConfig.starboardId;
      }

      // Check if this message is already on starboard 
      // (handle cases when star removed and re-added, i.e., trolling)
      isAlreadyOnStarboard = await Reaction.client.channels.fetch(starboardChannelId)
        .then(channel => channel.messages.fetch({limit: 20}))
        .then(messages => messages.some(m => m.embeds.length > 0 && m.embeds[0].footer.text === Reaction.message.id))
        .catch(console.error);
      
      if(isAlreadyOnStarboard) {
        // Discard, warn of abuse
        Reaction.client.channels.fetch(Reaction.message.channel.id)
        .then(channel => channel.send(`Knock it off or you won't be a ⭐ !`))
        .catch(console.error);
      }
      else {
        Reaction.client.channels.fetch(starboardChannelId)
        .then(channel => channel.send(starMessage))
        .catch(console.error);
      }
    }

    /*
    *   TODO: 
    *   A way to more robustly handle duplicates, currently limited by fetching last 20 of channel
    *   and this perhaps is more costly than it should be? Can we at least only fetch if cache is empty?
    *   Not exactly sure how the chache works just yet.
    */

    return;
  }
}

module.exports = ReactionHandler;
