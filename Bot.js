const EventEmitter = require('events');
const Discord = require('discord.js');
const MessageHandler = require('./MessageHandler');
const ReactionHandler = require('./ReactionHandler');

class Bot extends EventEmitter {
  /**
   * Initializes all modules, a Discord client, Firebase connection.
   * @constructor
   */
  constructor() {
    super();
    this.client = new Discord.Client();
    this.MessageHandler = new MessageHandler();
    this.ReactionHandler = new ReactionHandler();
    this.bindEvents();
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
    console.log('Shutting down.');
    this.client.destroy();
  }

  /**
   * Bind event functions.
   */
  bindEvents() {
    this.client.on('ready', this.onReady.bind(this));
    this.client.on('message', this.onMessage.bind(this));
  }

  /**
   * Bot is ready
   */
  onReady() {
    console.log(
      'Connected to Discord as ' +
      this.client.user.username + '#' + this.client.user.discriminator + ' ' +
      '<@' + this.client.user.id + '>'
    );
  }

  /**
   * Message handler.
   * Filters messages from bots, DMs, and staff.
   * @param {Message} Message Discord message object that fired the event
   */
  async onMessage(Message) {
    this.MessageHandler.handleMessage(Message);
  }
}

module.exports = Bot;
