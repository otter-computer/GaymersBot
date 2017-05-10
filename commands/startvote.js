/* *
 * DiscoBot - Gaymers Discord Bot
 * Copyright (C) 2015 - 2017 DiscoBot Authors
 *
 * This program is free software; you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation; either version 2 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License along
 * with this program; if not, write to the Free Software Foundation, Inc.,
 * 51 Franklin Street, Fifth Floor, Boston, MA 02110-1301 USA.
 * */

module.exports = {
  usage: 'Message | option 1, :one: | option 2, :two: | option n, :shrug:',
  description: 'Start a reaction based vote!',
  allowDM: false,
  process: (bot, message) => {

    function generateVote(message) {

      let guild = bot.guilds.first();
      let msg = message.cleanContent;


      // TODO handle removal of command prefix bettwe
      msg = msg.slice(11);
      // Split the message into command arguments on pipe
      msg = msg.split('|');
      let title = msg[0];
      // Remove title now we have it
      msg.shift();

      let outputString = '```markdown' + '\n';
      outputString +=  title + '\n';
      outputString +=  Array(title.length + 1).join('=') + '\n';

      for (let option of msg) {
        let optParts = option.split(',');
        let item = optParts[0];
        let emoji = optParts[1].trim();
        outputString += item + emoji + '\n';
        outputReactions.push(emoji);
      }
      outputString += '```';

      return outputString;
    }

    let outputReactions = [];
    const voteObj = generateVote(message);

    // Send output
    message.reply(voteObj)
        .then(
          () => {
            // What did I just send?
            const lastMessage = bot.user.lastMessage;

            // React
            for (let emoji of outputReactions) {

              //console.log('reacting with emoji: ' + emoji);
              lastMessage.react(emoji)
                .then(
                      () => {
                        //console.log('reacted with emoji: ' + emoji);
                      },
                      (rejectReason) => {
                        // TODO: Reject handler
                        console.error(rejectReason);
                      })
                    .catch((e) => {
                      // TODO: Error handler
                      console.error(e.stack);
                    });
            }
          },
          (rejectReason) => {
            // TODO: Reject handler
            console.error(rejectReason);
          })
        .catch((e) => {
          // TODO: Error handler
          console.error(e.stack);
        });
  }
};
