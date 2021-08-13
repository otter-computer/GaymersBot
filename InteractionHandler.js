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
   * Update commands
   */
   async updateCommands() {
    const data = [];

    this.commands.forEach(async cmd => {
      if (cmd.types.includes(`CHAT_INPUT`)) {
        data.push({
          name: cmd.name,
          description: cmd.description,
          options: cmd.options
        });
      }

      if (cmd.types.includes(`USER`)) {
        data.push({
          name: cmd.name.toLowerCase().split(' ').map(function(word) {
            return word.replace(word[0], word[0].toUpperCase());
          }).join(' '), // Title Case*
          type: `USER`
        });
      }

      if (cmd.types.includes(`MESSAGE`)) {
        data.push({
          name: cmd.name.toLowerCase().split(' ').map(function(word) {
            return word.replace(word[0], word[0].toUpperCase());
          }).join(' '), // Title Case*
          type: `MESSAGE`
        });
      }
    });
    // *This is a known bug for now that you can't set slash and context commands with the same name, so convert to title case for context.

    if (process.env.NODE_ENV === `production`) {
      await this.client.application?.commands.set(data);
    } else {
      await this.client.guilds.cache.first()?.commands.set(data);
    }
  }

  /**
   * Handles understanding an incoming interaction and passing it to the correct command handler.
   * @param {Interaction} Interaction The Discord interaction object
   */
  handleInteraction(Interaction) {
    if (Interaction.isCommand() || Interaction.isContextMenu()) {
      const command = this.commands.get(Interaction.commandName.toLowerCase());
      command.execute(Interaction);
    }

  }
}

module.exports = InteractionHandler;
