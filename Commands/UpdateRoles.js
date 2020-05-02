const Command = require(`./Command.js`);
const Discord = require(`discord.js`);
const roles = require(`../roles.json`);

class UpdateRoles extends Command {
  constructor() {
    super();
    this.name = `updateroles`;
    this.aliases = [`update-roles`];
    this.description = `Update the role list in the #roles channel`;
    this.usage = ``;
    this.serverOnly = true;
    this.staffOnly = true;
    this.disabled = true;
  }

  async execute(Message) {
    const rolesChannel = Message.guild.channels.cache.find(channel => channel.name === `roles`);

    // TODO: Build section embeds.
    const testEmbed = this.buildEmbed(
      `Test embed title`,
      `Test embed description`,
      `identity`
    );

    const existingMessages = await rolesChannel.messages.fetch({limit: 6});
    
    if (existingMessages.size > 0) {
      // TODO: Edit existing messages
    } else {
      // TODO: Send new messages, possibly react to them
    }

    rolesChannel.send(testEmbed);
  }

  buildEmbed(title, description, section) {
    const embed = new Discord.MessageEmbed();

    embed.setTitle(title);
    const emojis = []

    for (const roleEmoji in roles.reactions[section]) {
      const name = roles.reactions[section][roleEmoji];
      emojis.push(`${roleEmoji} ${name}`);
    }

    const mainContent = `${description}\n\n${emojis.join(`\n`)}`
    embed.setDescription(mainContent);
    return embed;
  }
}

module.exports = UpdateRoles;
