const Discord = require(`discord.js`);
const MessageHandler = require(`./MessageHandler`);
const ReactionHandler = require(`./ReactionHandler`);

class Bot {
  /**
   * Initializes all modules, a Discord client, binds events.
   * @constructor
   */
  constructor() {
    this.client = new Discord.Client({ partials: [`MESSAGE`, `CHANNEL`, `REACTION`] });
    this.MessageHandler = new MessageHandler();
    this.ReactionHandler = new ReactionHandler();
    this.bindEvents();
  }

  /**
   * Bind event functions.
   */
  bindEvents() {
    this.client.on(`ready`, this.onReady.bind(this));
    this.client.on(`message`, this.onMessage.bind(this));
    this.client.on(`messageReactionAdd`, this.onMessageReactionAdd.bind(this));
    this.client.on(`messageReactionRemove`, this.onMessageReactionRemove.bind(this));
  }

  /**
   * Login client to Discord.
   */
  connect() {
    this.client.login(process.env.AUTH_TOKEN);
  }

  /**
   * Destroy Discord client.
   */
  destroy() {
    console.log(`Shutting down.`);
    this.client.destroy();
  }

  /**
   * Passes message events to the MessageHandler.
   * @param {Message} Message The Discord message object.
   */
  onMessage(Message) {
    this.MessageHandler.handleMessage(Message);
  }

  /**
   * Passes reaction add events to the ReactionHandler.
   * @param {Reaction} Reaction The Discord reaction object.
   * @param {User} User The Discord user that added the reaction.
   */
  onMessageReactionAdd(Reaction, User) {
    this.ReactionHandler.handleReaction(`ADD`, Reaction, User);
  }

  /**
   * Passes reaction remove events to the ReactionHandler.
   * @param {Reaction} Reaction The Discord reaction object.
   * @param {User} User The Discord user that removed the reaction.
   */
  onMessageReactionRemove(Reaction, User) {
    this.ReactionHandler.handleReaction(`REMOVE`, Reaction, User);
  }

  /**
   * Bot is connected to Discord.
   */
  onReady() {
    console.log(`Connected to Discord as ${this.client.user.username}#${this.client.user.discriminator} <@${this.client.user.id}>`);
  }
}

module.exports = Bot;
