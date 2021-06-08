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
      .map(file => require(`./Commands/${file}`))
      .filter(cmd => cmd.name)
      .forEach(cmd => this.commands.set(cmd.name.toLowerCase(), new cmd()), this);
  }

  /**
   * Create slash commands
   */
   async createCommands() {
    // TODO: Loop over guilds?
    const data = [];

    this.commands.forEach(async cmd => {
      data.push({
        name: cmd.name,
        description: cmd.description,
        options: cmd.options
      });
    });

    await this.client.guilds.cache.first()?.commands.set(data);
  }

  /**
   * Update slash commands
   */
  async updateCommands() {
    // TODO: Loop over guilds?
    const data = [];

    this.commands.forEach(async cmd => {
      data.push({
        name: cmd.name,
        description: cmd.description,
        options: cmd.options
      });
    });

    await this.client.guilds.cache.first()?.commands.set(data);
  }

  /**
   * Handles understanding an incoming interaction and passing it to the correct command handler.
   * @param {Interaction} Interaction The Discord interaction object
   */
  handleInteraction(Interaction) {
    // Ignore non-command interactions
    if (!Interaction.isCommand()) return;

    const command = this.commands.get(Interaction.commandName);

    command.execute(Interaction);
  }
}

module.exports = InteractionHandler;
