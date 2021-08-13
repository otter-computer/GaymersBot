const Command = require(`./Command.js`);
const Discord = require(`discord.js`);

class Avatar extends Command {
  constructor() {
    super();
    this.name = `avatar`;
    this.description = `See a bigger version of someone's avatar—or your own!`;
    this.types = [`CHAT_INPUT`, `USER`];
    this.options = [{
      name: `user`,
      type: `USER`,
      description: `The owner of the avatar you want to see`,
      required: false,
    }];
  }

  async execute(Interaction) {
    let target;

    if (Interaction.isCommand()) {
      target = Interaction.options.get(`user`) ? Interaction.options.get(`user`).user : Interaction.user;
    }

    if (Interaction.isContextMenu()) target = await Interaction.options.getUser(`user`);

    const member = await Interaction.guild.members.fetch(target.id);

    if (member.roles.cache.some(role => role.name === `Private Avatar`)) {
      Interaction.reply({
        content: `${target.toString()} has made their avatar private.`,
        ephemeral: true
      });
      return;
    }

    const embed = new Discord.MessageEmbed();
    embed.setImage(target.displayAvatarURL({dynamic: true, size: 1024}));

    await Interaction.reply({
      content: `Here's ${member.toString()}'s avatar:`,
      embeds: [embed]
    });
  }
}

module.exports = Avatar;
