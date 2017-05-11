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

const splitargs = require('splitargs');

const voteEmojisBoolean = [
  '👍',
  '👎'
];

const voteEmojisNumbers = [
  ':one:',
  ':two:',
  ':three:',
  ':four:',
  ':five:',
  ':six:',
  ':seven:',
  ':eight:',
  ':nine:'
];

module.exports = {
  usage: 'Question, Option 1, Option 2, Option 3...',
  description: 'Start a reaction based vote!',
  allowDM: false,
  process: (bot, message) => {

    let voteMsg = splitargs(message.content);
    // Remove command
    voteMsg.shift();
    voteMsg = voteMsg.join(' ');

    // Split options
    voteMsg = voteMsg.split(',');

    // Get question
    const question = voteMsg[0];
    voteMsg.shift();

    // Options Array
    const options = voteMsg;

    if (options.length > 9) {
      message.reply('Sorry, I can\'t deal with more than 9 options :dizzy_face:');
      return;
    }

    let response = 'started a vote!\n' +
      '**' + question;

    // Add a question mark
    if (!response.endsWith('?')) response += '?';
    response += '**';

    // if (options.length > 0) {
    //   for (let i = 0; i < options.length; i++) {
    //     response += '\n' +
    //       voteEmojisNumbers[i] + ' - ' + options[i].trim();
    //   }
    // }

    // Send message
    message.channel.send(message.author.toString() + ' ' + response)
    .then((voteMessage) => {
      // React
      // if (options.length === 0) {
        for (let i = 0; i < voteEmojisBoolean.length; i++) {
          voteMessage.react(voteEmojisBoolean[i]);
        }
      // } else {
      //   for (let i = 0; i < options.length; i++) {
      //     voteMessage.react(voteEmojisNumbers[i]);
      //   }
      // }
    });
  }
};
