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
    else if (args[0] === 'ADD' && Reaction._emoji.name === '⭐') {
      this.handleStarReaction(Reaction, User);
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

  async handleStarReaction(Reaction, User) {
    await Reaction.fetch();
    let starboardChannelId;
    let isAlreadyOnStarboard = false;

    if (Reaction.count === starConfig.starThreshold
          && Reaction.message.author.bot === false
          && Reaction.message.type === `DEFAULT`
          && !starConfig.ignoreChannels.includes(Reaction.message.channel.name)) {
      // Message meets the star threshold, is a non-bot, non-system message, and not in a black-listed channel
      
      // Construct the starboard message
      const starMessage = new Discord.MessageEmbed()
          .setColor(`#d74894`)
          .setAuthor(`${Reaction.message.author.username}, your message belongs on the starboard:`, 
                     Reaction.message.author.displayAvatarURL({format:`png`})) // Utilizing png, iPhone App seems to not handle webp
          .setDescription(Reaction.message.content !== `` ? `${Reaction.message.content}` : `The message did not contain text, I've tried to attach it below.`)
          .addField(`You're a ⭐ !`, `[Original message](https://discord.com/channels/${Reaction.message.guild.id}/${Reaction.message.channel.id}/${Reaction.message.id})`)
          .setImage(Reaction.message.attachments.size === 0 ? `` : Reaction.message.attachments.values().next().value.url)
          .setTimestamp(Reaction.message.createdTimestamp)
          .setFooter(Reaction.message.id, Reaction.client.user.displayAvatarURL({format:`png`})) // Utilizing png, iPhone App seems to not handle webp

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
        .then(channel => channel.messages.fetch())
        .then(messages => messages.some(m => m.embeds.length > 0 && m.embeds[0].footer.text === Reaction.message.id))
        // Only run the check against messages that have embeds, i.e., posted by the bot
        .catch(console.error);
      
      if(isAlreadyOnStarboard) {
        // Discard, log potential abuse
        console.log(`${User.username} re-met the threshold, perhaps stars were removed once at the threshold`);
      }
      else {
        Reaction.client.channels.fetch(starboardChannelId)
        .then(channel => channel.send(starMessage))
        .then(Reaction.message.reply(`one of your messages made it on ${Reaction.message.guild.channels.cache.get(starboardChannelId).toString()}!`))
        .catch(console.error);
      }
    }

    return;
  }
}

module.exports = ReactionHandler;
