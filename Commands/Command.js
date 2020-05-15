class Command {
  constructor() {
    this.name = `name`;
    this.aliases = [];
    this.description = ``;
    this.usage = ``;
    this.serverOnly = false;
    this.staffOnly = false;
    this.disabled = false;
  }

  execute() {
    return;
  }
}

module.exports = Command;
