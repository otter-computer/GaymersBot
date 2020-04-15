const Command = require(`./Command.js`);

class Avatar extends Command {
  constructor() {
    super();
    this.name = `avatar`;
    this.aliases = [`pic`, `pfp`, `icon`];
    this.description = `See a bigger version of someone\`s avatar`;
    this.usage = `@someone`;
    this.serverOnly = true;
  }

  execute(Message) {
    let target;

    if (Message.mentions.users.size > 0) {
      target = Message.mentions.users.first();
    } else {
      target = Message.author;
    }

    // TODO: Check for Private Avatar role

    const avatarURL = target.displayAvatarURL({dynamic: true});

    Message.reply(`here's ${target.toString()}'s avatar: ${avatarURL}`);
  }
}

module.exports = Avatar;
