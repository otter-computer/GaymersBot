const Command = require('./Command.js');

class Hug extends Command {
  constructor() {
    super();
    this.name = 'hug'
    this.aliases = ['cuddle', 'snuggle'],
    this.description = 'Give someone a hug!'
    this.usage = '@someone',
    this.staffOnly = false
  }

  execute(Message, ...args) {
    let target;

    // const mentions = Message.mentions.users;

    if (Message.mentions.users.size > 0) {
      target = Array.from(Message.mentions.users.values()).join(', ');
    } else {
      target = Message.author.toString();
    }

    const responses = [
      `*hugs ${target}*`,
      `*hugs ${target}*`,
      `*hugs ${target}*`,
      `*hugs ${target}*`,
      `*licks ${target}*`,
      `*pounces ${target}*`,
      `*jumps on ${target}*`,
      `*glomps ${target}*`,
      `*falls on ${target}*`,
      `*bear hugs ${target}*`,
      `*tightly squeezes ${target}*`,
      `*embraces ${target}*`,
      `*holds ${target} close*`,
      `*cuddles ${target}*`
    ];

    Message.channel.send(responses[Math.floor(Math.random() * responses.length)]);
  }
}

module.exports = Hug;