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

    const identityEmbed = this.buildEmbed(Message, `Identity`, `React to add some roles that tell everyone about your identity.`, ``, `identity`);
    const pronounEmbed = this.buildEmbed(Message, `Pronouns`, `React to add some roles to tell everyone your pronouns.`, ``, `pronouns`);
    const orientationEmbed = this.buildEmbed(Message, `Orientation`, `React to add some roles to show your orientation.`, ``, `orientation`);
    const regionEmbed = this.buildEmbed(Message, `Region`, `React to add a role to tell everyone where in the world you're from.`, ``, `region`);
    const platformEmbed = this.buildEmbed(Message, `Platform`, `React to add some roles to tell us what gaming platforms you play on.`, ``, `platform`);
    const serverEmbed = this.buildEmbed(Message, `Server`, `React to add some roles that give you access to voice chat, certain channels, or ping you for special events.`, ``, `server`);
    const colorsEmbed = this.buildEmbed(Message, `Colors`, `React to give your name a color!`, ``, `colors`);

    const existingMessages = await rolesChannel.messages.fetch({limit: 7});
    
    if (existingMessages.size > 0) {
      // TODO: Edit existing messages
    } else {
      await rolesChannel.send(identityEmbed);
      await rolesChannel.send(pronounEmbed);
      await rolesChannel.send(orientationEmbed);
      await rolesChannel.send(regionEmbed);
      await rolesChannel.send(platformEmbed);
      await rolesChannel.send(serverEmbed);
      await rolesChannel.send(colorsEmbed);
    }
  }

  buildEmbed(Message, title, description, color, section) {
    const embed = new Discord.MessageEmbed();
    embed.setTitle(title);
    const emojis = []
    for (const roleEmoji in roles.reactions[section]) {
      const name = roles.reactions[section][roleEmoji];

      const idRegEx = /\d+/;

      const emoji = idRegEx.test(roleEmoji) ? Message.client.emojis.resolve(roleEmoji) : roleEmoji;
      emojis.push(`${emoji} ${name}`);
    }
    const mainContent = `${description}\n\n${emojis.join(`\n`)}`
    embed.setDescription(mainContent);
    return embed;
  }
}

module.exports = UpdateRoles;
