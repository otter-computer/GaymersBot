const Command = require(`./Command.js`);

class Joined extends Command {
  constructor() {
    super();
    this.name = `joined`;
    this.description = `See when someone joined the server.`;
    this.types = [`CHAT_INPUT`, `USER`];
    this.options = [{
      name: `user`,
      type: `USER`,
      description: `The user who's join date you want to see`,
      required: false,
    }];
  }

  async execute(Interaction) {
    let target;
    if (Interaction.isCommand()) target = Interaction.options.get(`user`) ? Interaction.options.get(`user`).user : Interaction.user;
    if (Interaction.isContextMenu()) target = await Interaction.options.getUser(`user`);

    const member = await Interaction.guild.members.fetch(target.id);
    const targetString = Interaction.member === member ? `You` : member.toString();;
    const content = `${targetString} joined <t:${Date.parse(member.joinedAt)/1000}:R>`;

    Interaction.reply({content: content});
  }
}

module.exports = Joined;
