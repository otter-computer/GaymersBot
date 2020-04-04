class Command {
  constructor() {
    this.name = 'name'
    this.aliases = [],
    this.description = ''
    this.usage = '',
    this.serverOnly = true,
    this.staffOnly = true
  }

  execute(Message, ...args) {
    return;
  }
}

module.exports = Command;