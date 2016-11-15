module.exports = {
  usage: '[amount]',
  description: 'ADMIN ONLY: Clears an amount of messages from chat.',
  process: (bot, message) => {
    try {
      message.channel.bulkDelete(message.cleanContent);
    } catch {
      message.reply('Cannot delete a nonnumber.');
    }
    
    message.reply('Deleted' + message.cleanContent + 'messages.'
  }
}
