const Command = require(`./Command.js`);
const Discord = require(`discord.js`);
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

    const embed = new Discord.MessageEmbed();
    embed.setTitle(`${member.displayName} joined ${moment(member.joinedAt).fromNow()}`);
    embed.addField(`Date:`, member.joinedAt.toString(), true);
    embed.setTimestamp(member.joinedAt);

    Interaction.reply({embeds:[embed]});
  }
}

module.exports = Joined;
