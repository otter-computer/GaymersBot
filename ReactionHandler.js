class ReactionHandler {
  constructor(Bot) {
    this.Bot = Bot;
  }

  handleReactionAdd(Reaction, User) {
    // Ignore if not in #roles
    if (!this.isInRolesChannel(Reaction.message.channel.name)) {
      return;
    }
  }

  handleReactionRemove(Reaction, User) {
    // Ignore if not in #roles
    if (!this.isInRolesChannel(Reaction.message.channel.name)) {
      return;
    }
  }

  isInRolesChannel(channelName) {
    if (channelName == 'Roles') {
      return true;
    } else {
      return false;
    }
  }
}

module.exports = ReactionHandler;
