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

      if (!command.name) continue;

      this.commands.set(command.name.toLowerCase(), new command());
    }
  }

  /**
   * Handles understanding an incoming message and passing it to the correct command handler.
   * @param {Message} Message The Discord message object
   */
  handleMessage(Message) {
    if (Message.system || Message.author.bot) return;

    if (roles.ignored.length > 0 && Message.member) {
      for (const ignoredRoleName of roles.ignored) {
        if (Message.member.roles.cache.findKey(role => role.name === ignoredRoleName)) return;
      }
    }

    if (Message.channel.name === `introductions`) {
      this.introAgeDetection(Message);
      return;
    }

    if (!Message.content.startsWith(`!`)) return;

    const args = Message.content.slice(1).split(/ +/);
    const commandName = args.shift().toLowerCase();
    const command = this.commands.get(commandName) || this.commands.find(cmd => cmd.aliases && cmd.aliases.includes(commandName));

    if (!command) return;

    if (command.disabled) return;

    if (command.serverOnly && Message.channel.type !== `text`) {
      Message.reply(`Sorry, this command can only be used inside the Gaymers server. Try again in #bot-room!`);
      return;
    }

    const isStaff = (Message.member.roles.cache.findKey(role => role.name === `Admin`) || Message.member.roles.cache.findKey(role => role.name === `Moderator`)) ? true : false;

    if (command.staffOnly && !isStaff) {
      return;
    }

    command.execute(Message, args);
  }

  async introAgeDetection(Message) {
    // Looking for 2 digit ages
    const ageRegEx = /[\d][\d]/;
    const memberAge = Message.content.match(ageRegEx);

    // If no age listed, do nothing
    if (!memberAge) return;

    // Presume first numberical hit is the age
    if (memberAge[0] < 18) {
      const under18Role = await Message.guild.roles.cache.find(role => role.name === `Under 18`);
      const over18Role = await Message.guild.roles.cache.find(role => role.name === `18+`);
      const Member = await Message.guild.members.fetch(Message.author.id);
      Member.roles.add(under18Role);
      Member.roles.remove(over18Role);
    }
  }
}

module.exports = MessageHandler;
