const fs = require('fs');
const Discord = require('discord.js');

class MessageHandler {
  constructor() {
    
    // Dynamically loadoad commands
    this.commands = new Discord.Collection();

    const commandFiles = fs.readdirSync('./Commands').filter(file => file.endsWith('.js'))

    for (const file of commandFiles) {
      const command = require(`./Commands/${file}`);

      // Skip the default Command class
      if (command.name === 'name') return;

      this.commands.set(command.name.toLowerCase(), new command());
    }
  }

  /**
   * Handles understanding an incoming message.
   * @param {Message} Message The Discord message object
   */
  handleMessage(Message) {
    // Ignore system and bot messages
    if (Message.system || Message.author.bot) return;

    // TODO: Convert to dynamic DM detection
    // If not in a text channel, reply bot is not available
    if (!(Message.channel instanceof Discord.TextChannel)) {
      Message.reply(`Sorry, I can't be used in DMs. Try your message again in #bot-room in Gaymers`);
      return;
    }

    // Ignore if not using command prefix
    if (!Message.content.startsWith('!')) return;

    const args = Message.content.slice(1).split(/ +/);
    const commandName = args.shift().toLowerCase();
    const command = this.commands.get(commandName) || this.commands.find(cmd => cmd.aliases && cmd.aliases.includes(commandName));

    if (!command) return;

    command.execute(Message, args);
  }
}

module.exports = MessageHandler;
