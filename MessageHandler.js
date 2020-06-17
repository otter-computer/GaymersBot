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
    // Looking for 2 digit ages, presume first numberical hit is the age
    const ageRegEx = /[\d][\d]/;
    const memberAge = Message.content.match(ageRegEx);
    
    // Alternatively, look certain phrases
    const under18RegEx = /(under ?18)/i;
    const under18 = Message.content.match(under18RegEx);

    // Fetch the member and necessary roles.
    const Member = await Message.guild.members.fetch(Message.author.id);
    const under18Role = await Message.guild.roles.cache.find(role => role.name === `Under 18`);
    const over18Role = await Message.guild.roles.cache.find(role => role.name === `18+`);
    
    // Check if memberAge exists and presume first double-digit numerical hit is the age ([0])
    // Or detect if they've explicitly said one of the phrases
    // If member is under 18, add the `Under 18` role. Remove the `18+` Role if they have it somehow. 
    if ((memberAge && memberAge[0] < 18) || under18) {
      Member.roles.add(under18Role);
      Member.roles.remove(over18Role);
      return;
    }

    // If member is 18 or older, add `18+` role. Remove the `Under 18` role if they have it somehow. 
    if (memberAge[0] >= 18) {
      Member.roles.add(over18Role);
      Member.roles.remove(under18Role);
      return;
    }
  }
}

module.exports = MessageHandler;
