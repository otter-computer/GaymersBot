const Discord = require(`discord.js`);
const InteractionHandler = require(`./InteractionHandler`);
const MessageHandler = require(`./MessageHandler`);
const ReactionHandler = require(`./ReactionHandler`);

class Bot {
  /**
   * Initializes all modules, a Discord client, binds events.
   * @constructor
   */
  constructor() {
    this.client = new Discord.Client({ 
      partials: [`CHANNEL`, `MESSAGE`, `REACTION`, `USER`],
      intents: Discord.Intents.ALL
    });
    this.InteractionHandler = new InteractionHandler(this.client);
    this.MessageHandler = new MessageHandler();
    this.ReactionHandler = new ReactionHandler();
    this.bindEvents();
  }

  /**
   * Bind event functions.
   */
  bindEvents() {
    this.client.on(`ready`, this.onReady.bind(this));
    this.client.on(`interaction`, this.onInteraction.bind(this));
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
   * Passes interaction events to the InteractionHandler.
   * @param {Interaction} Interaction The Discord interaction object.
   */
   onInteraction(Interaction) {
    this.InteractionHandler.handleInteraction(Interaction);
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
    this.ReactionHandler.handleReaction(Reaction, User, `ADD`);
  }

  /**
   * Passes reaction remove events to the ReactionHandler.
   * @param {Reaction} Reaction The Discord reaction object.
   * @param {User} User The Discord user that removed the reaction.
   */
  onMessageReactionRemove(Reaction, User) {
    this.ReactionHandler.handleReaction(Reaction, User, `REMOVE`);
  }

  /**
   * Bot is connected to Discord.
   */
  onReady() {
    this.InteractionHandler.loadCommands();
    console.log(`Connected to Discord as ${this.client.user.username}#${this.client.user.discriminator} <@${this.client.user.id}>`);
  }
}

module.exports = Bot;
