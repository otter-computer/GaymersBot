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
    // TODO: REMOVE THIS FOR PROD.
    if(process.env.DEV && Message.guild.id === `123315443208421377`) return;

    if (Message.system || Message.author.bot) return;

    if (roles.ignored.length > 0 && Message.member) {
      for (const ignoredRoleName of roles.ignored) {
        if (Message.member.roles.cache.findKey(role => role.name === ignoredRoleName)) return;
      }
    }

    if (!Message.content.startsWith(`!`)) return;

    const args = Message.content.slice(1).split(/ +/);
    const commandName = args.shift().toLowerCase();
    const command = this.commands.get(commandName) || this.commands.find(cmd => cmd.aliases && cmd.aliases.includes(commandName));

    if (!command) return;

    if (command.disabled) return;

    if (command.serverOnly && Message.channel.type !== `text`) {
      Message.reply(`Sorry, this command can only be used inside the Gaymers server. Try again in #bot-room!`)
      return;
    }

    const isStaff = (Message.member.roles.cache.findKey(role => role.name === `Admin`) || Message.member.roles.cache.findKey(role => role.name === `Moderator`)) ? true : false;

    if (command.staffOnly && !isStaff) {
      return;
    }

    command.execute(Message, args);
  }

  // TODO: Handle automatic age detection in #introductions
}

module.exports = MessageHandler;
