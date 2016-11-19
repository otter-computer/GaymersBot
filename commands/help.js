const commands = require('../index');

module.exports = {
  usage: '',
  description: 'See what commands I can run!',
  process: (bot, message, permission) => {
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

    // Admin commands
    if (permission) {
      let adminMessage = 'Admin only commands';
      commandString = '```';
      commandArray = [];

      for (var command in commands.adminCommands) {
        let cmd = commands.adminCommands[command];
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

      message.author.sendMessage(adminMessage);

      for (let i = 0; i < commandArray.length; i++) {
        message.author.sendMessage(commandArray[i]);
      }
    }

    // If !help was run in a public channel, send a message to that channel too
    if (message.channel.type === 'text') {
      message.reply('Check your DMs :wink:');
    }
  }
};
