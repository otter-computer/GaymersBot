const commands = require('../index');

module.exports = {
  usage: '',
  description: 'See what commands I can run!',
  process: (bot, message) => {
    let firstMessage = 'Available Commands';
    let commandString = '```';
    let commandArray = [];

    for (var command in commands.commands) {
      let cmd = commands.commands[command];
      let info = '!' + command;

      if (cmd.usage) {
        info += ' ' + cmd.usage;
      }

      if (cmd.description) {
        info += ' - ' + cmd.description;
      }

      if ((commandString.length + info.length) < 1900) {
        commandString += info + '\n';
      } else {
        commandString += '```';
        commandArray.push(commandString);
        commandString = '```'; // Reset
        commandString += info + '\n';
      }
    }
    commandString += '```';
    commandArray.push(commandString);

    message.author.sendMessage(firstMessage);

    for (let i = 0; i < commandArray.length; i++) {
      message.author.sendMessage(commandArray[i]);
    }

    // TODO include admin commands
  }
};
