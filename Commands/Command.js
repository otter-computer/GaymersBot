class Command {
  constructor() {
    this.name = 'name'
    this.aliases = [],
    this.description = ''
    this.usage = '',
    this.serverOnly = true
  }

  execute() {
    return;
  }
}

module.exports = Command;