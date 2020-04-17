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
  }

  async execute(Message) {
    const rolesChannel = Message.guild.channels.cache.find(channel => channel.name === `roles`);

    // TODO: Build section embeds.

    const existingMessages = await rolesChannel.messages.fetch({limit: 6});
    
    if (existingMessages.size > 0) {
      // TODO: Edit existing messages
    } else {
      // TODO: Send new messages, possibly react to them
    }
  }
}

module.exports = UpdateRoles;
