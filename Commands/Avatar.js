const Command = require(`./Command.js`);

class Avatar extends Command {
  constructor() {
    super();
    this.name = `avatar`;
    this.description = `See a bigger version of someone's avatar—or your own!`;
    this.options = [{
      name: `user`,
      type: `USER`,
      description: `The user who's avatar you want to see`,
      required: false,
    }];
  }

  async execute(Interaction) {
    await Interaction.defer();
    const target = Interaction.options.get(`user`) ? Interaction.options.get(`user`).user : Interaction.user;
    
    const member = await Interaction.guild.members.fetch(target.id);

    if (member.roles.cache.findKey(role => role.name === `Private Avatar`)) {
      Message.reply(`${member.toString()} has made their avatar private.`);
      return;
    }

    await Interaction.editReply(`here's ${member.toString()}'s avatar: ${target.displayAvatarURL({dynamic: true, size: 1024})}`);
  }
}

module.exports = Avatar;
