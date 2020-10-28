const Command = require(`./Command.js`);

class Help extends Command {
  constructor() {
    super();
    this.name = `help`;
    this.aliases = [`h`, `commands`, `halp`];
    this.description = `View available commands the bot can handle`;
    this.usage = ``;
    this.serverOnly = true;
  }

  async execute(Message) {
        Message.channel.send({embed: {
            color: `#d74894`,
            author: {
              name: Message.client.user.username,
              icon_url: `https://cdn.discordapp.com/avatars/${Message.client.user.id}/${Message.client.user.avatar}.png`
            },
            title: `Here are the available Kirby commands`,
            description: `Tip: for all commands do not include the square brackets "[]"`,
            fields: [{
                name: `!iplay [game]`,
                value: `Tell us which games you play! This will add a pingable role so you can find other people to play with`
              },
              {
                name: `!iplay`,
                value: `See the list of available game roles`
              },
              {
                name: `!joined [@someone]`,
                value: `See when someone joined the server`
              },
              {
                name: "!avatar [@someone]",
                value: `See a bigger version of someone's avatar`
              }
            ]
          }
        });
  }
}

module.exports = Help;
