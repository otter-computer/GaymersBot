const Command = require(`./Command.js`);

class Spell extends Command {
  constructor() {
    super();
    this.name = `spell`;
    this.aliases = [`cast`];
    this.description = `Cast some magic spells.`;
    this.usage = `[spell]`;
    this.serverOnly = true;
    this.staffOnly = true;
  }

  execute(Message) {
    const args = Message.content.slice(1).split(/ +/);
    const spell = args[1].toLowerCase();

    if (spell === `slowga`) {
      const time = args[2];
      const rateLimit = time ? time : `10`;
      Message.channel.setRateLimitPerUser(rateLimit);
      return;
    }

    if (spell === `esunaga`) {
      Message.channel.setRateLimitPerUser(`0`);
      return;
    }
  }
}

module.exports = Spell;
