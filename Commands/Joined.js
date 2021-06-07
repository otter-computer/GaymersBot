const Command = require(`./Command.js`);
const Discord = require('discord.js');
const moment = require('moment');

class Joined extends Command {
  constructor() {
    super();
    this.name = `joined`;
    this.description = `See when someone joined the server.`;
    this.options = [{
      name: `user`,
      type: `USER`,
      description: `The user who's join date you want to see`,
      required: false,
    }];
  }

  async execute(Interaction) {
    const target = Interaction.options.get(`user`) ? Interaction.options.get(`user`).user : Interaction.user;

    const member = await Interaction.guild.members.fetch(target.id);

    Interaction.reply(`${member.toString()} joined ${moment(member.joinedAt).fromNow()}\n> ${member.joinedAt}`);
  }
}

module.exports = Joined;
