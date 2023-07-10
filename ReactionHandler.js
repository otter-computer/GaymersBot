const Discord = require(`discord.js`);
const starConfig = require(`./star-config`);

class ReactionHandler {
  constructor() {
    this.lastStar = {
      user: null,
      message: null
    }
  }

  async handleReaction(Reaction, User, type) {
    if (Reaction.partial) await Reaction.fetch();

    if (Reaction.me) return;

    if (type === `ADD` && Reaction.emoji.name === '⭐') {
      // this.handleStarReaction(Reaction, User);
      return;
    }
  }

  async handleStarReaction(Reaction, User) {
    // Save the last reactor, prevent some starboard abuse.
    if (User.id === this.lastStar.user && Reaction.message.id == Reaction.message.id) return;

    this.lastStar = {
      user: User.id,
      message: Reaction.message.id
    };

    // Only continue if reaction count matches the star threshold
    if (Reaction.count !== starConfig.starAmount) return;

    // Ignore messages from bots
    if (Reaction.message.author.bot) return;

    // Ignore channels in config
    if (starConfig.ignoreChannels.includes(Reaction.message.channel.name.toLowerCase())) return;

    // Ignore sections in config
    if (starConfig.ignoreSections.includes(Reaction.message.channel.parent.name.toLowerCase())) return;

    // Build the embed
    const embed = new Discord.MessageEmbed();

    embed.setColor(`#d74894`);
    embed.setAuthor(Reaction.message.author.username, Reaction.message.author.displayAvatarURL({format:`png`}));
    embed.addField(`Original message`, `[Link](${Reaction.message.url})`);
    if (Reaction.message.content) embed.setDescription(Reaction.message.content);
    embed.setTimestamp(Reaction.message.createdTimestamp);

    // Dynamically get starboard
    const starboardChannel = await this.getStarboardChannel(Reaction.message);

    if (Reaction.message.attachments.size) {
      starboardChannel.send({embeds: [embed], files: [Reaction.message.attachments.first().url]});
    } else {
      starboardChannel.send({embeds: [embed]});
    }
  }

  async getStarboardChannel(Message) {
    if (Message.channel.parent.name.toLowerCase() === "over 18") {
      return await Message.guild.channels.cache
      .filter(channel => channel.name.toLowerCase() === "starboard")
      .find(channel => channel.parent.name.toLowerCase() === "over 18");
    } else {
      return await Message.guild.channels.cache
      .filter(channel => channel.name.toLowerCase() === "starboard")
      .find(channel => channel.parent.name.toLowerCase() !== "over 18");
    }
  }
}

module.exports = ReactionHandler;
