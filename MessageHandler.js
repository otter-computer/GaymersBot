class MessageHandler {
  /**
   * Handles understanding an incoming message and passing it to the correct command handler.
   * @param {Message} Message The Discord message object
   */
  handleMessage(Message) {
    if (Message.system || Message.author.bot) return;

    if (Message.channel.name === `introductions`) {
      this.introAgeDetection(Message);
      return;
    }
  }

  async introAgeDetection(Message) {
    // Looking for 2 digit ages following `Age: ` (or variants)
    // or look for the phrases `Under 18` or `Minor`
    const ageRegEx = /(?:(?<=age|i'?m)[*_ :\-=]*(?<age>[\d][\d]))|(?<text>under ?18|minor)/i;
    const matches = ageRegEx.exec(Message.content);

    // Fetch the member and necessary roles.
    const Member = await Message.guild.members.fetch(Message.author.id);
    const under18Role = await Message.guild.roles.cache.find(role => role.name === `Under 18`);
    const over18Role = await Message.guild.roles.cache.find(role => role.name === `18+`);

    // Don't do anything if there aren't any matches
    if (!matches) return;

    // TODO: Don't do anything if the user already has an age role

    // If age is detected and the matched age is less than 13
    // mute the member and alert staff.
    if (matches.groups.age && matches.groups.age < 13) {
      // TODO: Restrict user here.
    }

    // If age is detected and matched age is less than 18
    // or if one of the minor phrases matched
    // add `Under 18` role. Remove the `18+` role if they have it. 
    if (matches.groups.text || (matches.groups.age && matches.groups.age < 18)) {
      Member.roles.add(under18Role);
      Member.roles.remove(over18Role);
      return;
    }

    // If age is detected and matched age is 18 or greater
    // add `18+` role. Remove the `Under 18` role if they have it. 
    if (matches.groups.age && matches.groups.age >= 18) {
      Member.roles.add(over18Role);
      Member.roles.remove(under18Role);
      return;
    }
  }
}

module.exports = MessageHandler;
