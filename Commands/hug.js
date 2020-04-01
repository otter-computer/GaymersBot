const Command = require('./Command.js');

class Hug extends Command {
  constructor() {
    super();
    this.name = 'hug'
    this.aliases = ['cuddle', 'snuggle'],
    this.description = 'Give someone a hug!'
    this.usage = '@someone'
  }

  execute(Message, ...args) {

  }
}

module.exports = Hug;