module.exports = {
  usage: '[amount]',
  description: 'ADMIN ONLY: Clears an amount of messages from chat.',
  process: (bot, message) => {
    number = message.cleanContent.strip('!');
    try {
      message.channel.bulkDelete(number);
    } catch {
      message.reply('Cannot delete a nonnumber.');
    }
    
    message.reply('Deleted' + message.cleanContent + 'messages.')
  }
}
