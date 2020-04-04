class Action {
  constructor() {
    this.name = 'name'
    this.aliases = [],
    this.description = ''
    this.usage = '',
    this.serverOnly = true
  }

  execute(Message, ...args) {
    return;
  }
}

module.exports = Action;