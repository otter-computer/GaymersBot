const Command = require(`./Command.js`);
const fs = require(`fs`);
const Discord = require('discord.js');

class Help extends Command {
  constructor() {
    super();
    this.name = `help`;
    this.aliases = [`h`, `commands`, `halp`];
    this.description = `View available commands the bot can handle.`;
    this.usage = ``;
    this.serverOnly = true;

    // Dynamically load commands
    // I know this means commands are loaded twice
    // TODO: inherit these from the MessageHandler when Help is instantiated
    this.commands = new Discord.Collection();

    const commandFiles = fs.readdirSync(`./Commands`)
      .filter(file => file.endsWith(`.js`))
      .filter(file => file !== `Command.js`)
      .filter(file => file !== `Help.js`)
      .map(file => require(`../Commands/${file}`))
      .filter(cmd => cmd.name)
      .forEach(cmd => this.commands.set(cmd.name.toLowerCase(), new cmd()), this);
  }

  async execute(Message) {
    const embed = new Discord.MessageEmbed();

    embed.setColor(0xD74894);

    const commands = this.commands
    .filter(command => !command.staffOnly)
    .filter(command => !command.disabled);

    commands.forEach(command => {
      embed.addField(`!${command.name} ${command.usage}`, command.description, false);
    });

    embed.setFooter(`Square brackets [] mean this part is optional. You don't need to include the brackets themselves in the command.`)

    Message.reply(`Here's the commands you can use:`, {embed: embed});
  }
}

module.exports = Help;
