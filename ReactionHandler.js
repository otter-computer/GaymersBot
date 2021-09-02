const Discord = require(`discord.js`);
const starConfig = require(`./star-config`);

class ReactionHandler {
  handleReaction(Reaction, User, type) {
    if (Reaction.me) return;

    if (type === `ADD` && Reaction._emoji.name === '⭐') {
      this.handleStarReaction(Reaction, User);
      return;
    }
  }

  async handleStarReaction(Reaction, User) {
    await Reaction.fetch();

    // Only continue if reaction count matches the star threshold
    if (Reaction.message.channel.parent.name.toLowerCase() === `over 18`) {
      if (Reaction.count !== starConfig.over18StarAmount) return;
    } else {
      if (Reaction.count !== starConfig.starAmount) return;
    }

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
    if (Reaction.message.attachments.size) embed.attachFiles(Reaction.message.attachments.array());
    embed.setTimestamp(Reaction.message.createdTimestamp);

    // Dynamically get starboard
    const starboardChannel = await this.getStarboardChannel(Reaction.message);

    starboardChannel.send({embed: embed});
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
