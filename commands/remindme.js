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

const createEvent = require('../msgq/messageCreate');
const moment = require('moment');

module.exports = {
  usage: 'remindme in XX minutes/hours/days [message]',
  description: 'Sets a reminder, bot will DM you',
  allowDM: false,
  process: (bot, message) => {

    time = message.match(/(\d+days)?(\d+day)?(\d+hours)?(\d+hour)?(\d+minutes?)?(\d+minute?)?(\d+min?)?(\d+mins?)?/);

    messageObj = {};

    messageObj.action = 'NOTIFY';
    messageObj.channel = 'alt-test';
    if (time){
      if (time.match(/(\d+days)?(\d+day)?/)){
        timeObj = moment(Date.now()).add(parseInt(time), 'days');
      }
      else if (time.match(/(\d+hours)?(\d+hour)?/)){
        timeObj = moment(Date.now()).add(parseInt(time), 'hours');
      }
      else if (time.match(/(\d+minutes)?(\d+minute)?(\d+min?)?(\d+mins?)?/)){
        timeObj = moment(Date.now()).add(parseInt(time), 'minutes');
      }
      msgDelay = timeObj;
    }
    else {
      msgDelay = 0;
    }
    messageObj.delay = msgDelay;
    messageObj.message = 'test';

    createEvent.process(bot, messageObj);

  }
};
