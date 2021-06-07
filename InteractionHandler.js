const fs = require(`fs`);
const Discord = require(`discord.js`);

class InteractionHandler {
  constructor(client) {
    // Dynamically load commands
    this.commands = new Discord.Collection();
    this.client = client;

    fs.readdirSync(`./Commands`)
      .filter(file => file.endsWith(`.js`))
      .filter(file => file !== 'Command.js')
      .filter(file => file !== 'Help.js')
      .map(file => require(`./Commands/${file}`))
      .filter(cmd => cmd.name)
      .forEach(cmd => this.commands.set(cmd.name.toLowerCase(), new cmd()), this);
  }

  /**
   * Load slash commands
   */
  async loadCommands() {
    // TODO: Loop over guilds
    this.commands.forEach(async cmd => {
      await this.client.guilds.cache.get(`213292759878991872`)?.commands.create({
        name: cmd.name,
        description: cmd.description
      });
    });
  }

  /**
   * Handles understanding an incoming interaction and passing it to the correct command handler.
   * @param {Interaction} Interaction The Discord interaction object
   */
  handleInteraction(Interaction) {
    // if (Interaction.system || Interaction.author.bot) return;

    // const commandName = args.shift().toLowerCase();
    // const command = this.commands.get(commandName) || this.commands.find(cmd => cmd.aliases && cmd.aliases.includes(commandName));

    // const isStaff = (Interaction.member.roles.cache.findKey(role => role.name === `Admin`) || Interaction.member.roles.cache.findKey(role => role.name === `Moderator`)) ? true : false;

    // if (command.staffOnly && !isStaff) {
    //   return;
    // }

    // command.execute(Interaction, args);
  }
}

module.exports = InteractionHandler;
