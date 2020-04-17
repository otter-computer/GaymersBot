const fs = require(`fs`);
const Discord = require(`discord.js`);
const roles = require(`./roles`);

class MessageHandler {
  constructor() {
    // Dynamically loadoad commands
    this.commands = new Discord.Collection();

    const commandFiles = fs.readdirSync(`./Commands`).filter(file => file.endsWith(`.js`));

    for (const file of commandFiles) {
      // Skip template class
      if (file === `Command.js`) continue;

      const command = require(`./Commands/${file}`);

      this.commands.set(command.name.toLowerCase(), new command());
    }
  }

  /**
   * Handles understanding an incoming message and passing it to the correct command handler.
   * @param {Message} Message The Discord message object
   */
  handleMessage(Message) {
    if(process.env.DEV && Message.guild.id === `123315443208421377`) return;

    // Ignore system and bot messages
    if (Message.system || Message.author.bot) return;

    // Ignore Restricted/Bot Restricted roles
    if (roles.ignored.length > 0 && Message.member) {
      for (const ignoredRoleName of roles.ignored) {
        if (Message.member.roles.cache.findKey(role => role.name === ignoredRoleName)) return;
      }
    }

    // Ignore if not using command prefix
    if (!Message.content.startsWith(`!`)) return;

    const args = Message.content.slice(1).split(/ +/);
    const commandName = args.shift().toLowerCase();
    const command = this.commands.get(commandName) || this.commands.find(cmd => cmd.aliases && cmd.aliases.includes(commandName));

    if (!command) return;

    if (command.serverOnly && Message.channel.type !== `text`) {
      Message.reply(`Sorry, this command can only be used inside the Gaymers server. Try again in #bot-room!`)
      return;
    }

    command.execute(Message, args);
  }
}

module.exports = MessageHandler;
