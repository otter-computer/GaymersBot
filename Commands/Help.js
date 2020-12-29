const Command = require(`./Command.js`);
const fs = require(`fs`);
const Discord = require('discord.js');

class Help extends Command {
  constructor(commands) {
    super();
    this.name = `help`;
    this.aliases = [`h`, `commands`, `halp`];
    this.description = `View available commands the bot can handle.`;
    this.usage = ``;
    this.serverOnly = true;

    this.commands = commands;
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
