const fs = require(`fs`);
const Command = require(`./Command.js`);
const Discord = require(`discord.js`);

class Help extends Command {
  constructor() {
    super();
    this.name = `help`;
    this.aliases = [`command`, `commands`];
    this.description = `How to use the bot!`;
    this.usage = ``;
    this.serverOnly = true;
    this.disabled = true;

    // Dynamically load commands
    // this.commands = new Discord.Collection();

    // const commandFiles = fs.readdirSync(`./`).filter(file => file.endsWith(`.js`));

    // for (const file of commandFiles) {
    //   // Skip template class
    //   if (file === `Command.js`) continue;

    //   const command = require(`./${file}`);

    //   this.commands.set(command.name.toLowerCase(), new command());
    // }
  }

  execute(Message) {
    const args = Message.content.slice(1).split(/ +/);
    const data = [];

    if (!args[1]) {
      data.push('Here\'s a list of all my commands:');
      data.push(this.commands.map(command => command.name).join(', '));
      data.push(`\nYou can send \`!help [command name]\` to get info on a specific command!`);

      return Message.reply(data, { split: true });
    }

    const name = args[1].toLowerCase();
    const command = this.commands.get(name) || this.commands.find(c => c.aliases && c.aliases.includes(name));

    if (!command) {
      return Message.reply('that\'s not a valid command!');
    }

    data.push(`**Name:** ${command.name}`);

    if (command.aliases) data.push(`**Aliases:** ${command.aliases.join(`, `)}`);
    if (command.description) data.push(`**Description:** ${command.description}`);
    if (command.usage) data.push(`**Usage:** !${command.name} ${command.usage}`);

    Message.channel.send(data, { split: true });
  }
}

module.exports = Help;
