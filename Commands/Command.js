class Command {
  constructor() {
    this.name = 'name';
    this.aliases = [];
    this.description = '';
    this.usage = '';
    this.serverOnly = false;
    this.staffOnly = false;
  }

  execute(Message, ...args) {
    return;
  }
}

module.exports = Command;
