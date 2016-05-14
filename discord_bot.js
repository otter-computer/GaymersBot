try {
  var Discord = require("discord.js");
} catch (e) {
  console.log(e.stack);
  console.log(process.version);
  console.log("Please run npm install and ensure it passes with no errors!");
  process.exit();
}

// Get authentication data
try {
  var AuthDetails = require("./auth.json");
} catch (e) {
  console.log("Please create an auth.json like auth.json.example with at least an email and password.\n" + e.stack);
  process.exit();
}

// Load custom permissions
var Permissions = {};
try {
  Permissions = require("./permissions.json");
} catch (e) {}
Permissions.checkPermission = function(user, permission) {
  try {
    var allowed = false;
    try {
      if (Permissions.global.hasOwnProperty(permission)) {
        allowed = Permissions.global[permission] == true;
      }
    } catch (e) {}
    try {
      if (Permissions.users[user.id].hasOwnProperty(permission)) {
        allowed = Permissions.users[user.id][permission] == true;
      }
    } catch (e) {}
    return allowed;
  } catch (e) {}
  return false;
}

//load config data
var Config = {};
try {
  Config = require("./config.json");
} catch (e) { //no config file, use defaults
  Config.debug = false;
  Config.respondToInvalid = false;
}

var d20 = require("d20");

var startTime = Date.now();

var Q = require("Q");

var randomFromArray = function(array) {
  return array[Math.floor(Math.random() * array.length)];
}

var removeRegions = function(msg) {

  var user = msg.sender;

  var deferred = Q.defer();

  var regions = [
    msg.channel.server.roles.get("name", "Europe"),
    msg.channel.server.roles.get("name", "North America"),
    msg.channel.server.roles.get("name", "South America"),
    msg.channel.server.roles.get("name", "Middle East"),
    msg.channel.server.roles.get("name", "Oceania"),
    msg.channel.server.roles.get("name", "Africa"),
    msg.channel.server.roles.get("name", "Asia")
  ];

  for (i = 0; i < regions.length; ++i) {
    if (user.hasRole(regions[i])) {
      //console.log('user: '+user.username+', has role: '+regions[i].name);
      user.removeFrom(regions[i], function(err) {
        if (!err) {
          deferred.resolve(regions[i].name);
          console.log('role removed - user: ' + user.username + ', has role: ' + regions[i].name);
        } else {
          console.log('error removing user: ' + user.username + ', role: ' + regions[i].name);
          deferred.reject(new Error("Could not remove region"));
        }

      });
    }
  }
  return deferred.promise;
}

var logMessage = function(bot, message, channelname) {
  if (!channelname) {
    channelname = 'log';
  }
  var channel = bot.channels.get("name", channelname);
  bot.sendMessage(channel, message);
}

var setRole = function(msg, rolename) {
  var user = msg.sender;
  var role = msg.channel.server.roles.get("name", rolename);
  var message = "";
  if (!user.hasRole(role)) {
    user.addTo(role, function(err) {
      if (!err) {
        message = msg.sender + " has been added to " + role.name;
      } else {
        message = "Unable to comply.";
      }
    });
  } else {
    message = msg.sender + " is already in " + role.name;
  }
  bot.sendMessage(msg.channel, message);
}

var unsetRole = function(msg, rolename) {
  var user = msg.sender;
  var role = msg.channel.server.roles.get("name", rolename);
  var message = "";
  if (user.hasRole(role)) {
    user.removeFrom(role, function(err) {
      if (!err) {
        message = msg.sender + " has been removed from " + role.name;
      } else {
        message = "Unable to comply.";
      }
    });
  } else {
    message = msg.sender + " does not have role " + role.name;
  }
  bot.sendMessage(msg.channel, message);
}

var hugReplies = [
  '*hugs $USER*',
  '*hugs $USER*',
  '*hugs $USER*',
  '*hugs $USER*',
  '*licks $USER*',
  '*pounces $USER*',
  '*jumps on $USER*',
  '*glomps $USER*',
  '*falls on $USER*',
  '*bear hugs $USER*',
  '*tightly squeezes $USER*',
  '*embraces $USER*',
  '*holds $USER close*',
  '*cuddles $USER*',
  '*takes $USER into his arms*'
];

var pokeReplies = [
  'STOP TOUCHING ME!',
  'LEAVE ME ALONE',
  'can I go home now?',
  'It\'s dark in here..',
  'AAAAAAAAAAAAH',
  'NO',
  '*giggles*',
  '*moans*',
  ';)',
  ':(',
  'h-hello?',
  '*pokes back*',
  'D: not there!',
  'A bit lower...',
  'WHAT DO YOU WANT?!',
  'bleep',
  'Well hello there ;)',
  '*blush* not now! everybody is watching..',
  '*falls over*',
  '*winks*',
  'N-nani',
  'Don\'t stop there.',
  'More please ;)',
  'Only one finger?',
  'Come here ;)'
];

var slapReplies = [
  '*slaps $USER around a bit with a large, girthy trout*',
  '*slaps $USER with a meaty sausage*',
  '*slaps $USER with a massive bag of spaghetti*'
];

var commands = {
  "ping": {
    description: "responds pong, useful for checking if bot is alive",
    process: function(bot, msg, suffix) {
      bot.sendMessage(msg.channel, msg.sender + " pong!");
      if (suffix) {
        bot.sendMessage(msg.channel, "note that !ping takes no arguments!");
      }
    }
  },

  "roll": {
    usage: "[# of sides] or [# of dice]d[# of sides]( + [# of dice]d[# of sides] + ...)",
    description: "roll one die with x sides, or multiple dice using d20 syntax. Default value is 10",
    process: function(bot, msg, suffix) {
      if (suffix.split("d").length <= 1) {
        bot.sendMessage(msg.channel, msg.author + " rolled a " + d20.roll(suffix || "10"));
      } else if (suffix.split("d").length > 1) {
        var eachDie = suffix.split("+");
        var passing = 0;
        for (var i = 0; i < eachDie.length; i++) {
          if (eachDie[i].split("d")[0] < 50) {
            passing += 1;
          };
        }
        if (passing == eachDie.length) {
          bot.sendMessage(msg.channel, msg.author + " rolled a " + d20.roll(suffix));
        } else {
          bot.sendMessage(msg.channel, msg.author + " tried to roll too many dice at once!");
        }
      }
    }
  },
  "uptime": {
    usage: "",
    description: "returns the amount of time since the bot started",
    process: function(bot, msg, suffix) {
      var now = Date.now();
      var msec = now - startTime;
      console.log("Uptime is " + msec + " milliseconds");
      var days = Math.floor(msec / 1000 / 60 / 60 / 24);
      msec -= days * 1000 * 60 * 60 * 24;
      var hours = Math.floor(msec / 1000 / 60 / 60);
      msec -= hours * 1000 * 60 * 60;
      var mins = Math.floor(msec / 1000 / 60);
      msec -= mins * 1000 * 60;
      var secs = Math.floor(msec / 1000);
      var timestr = "";
      if (days > 0) {
        timestr += days + " days ";
      }
      if (hours > 0) {
        timestr += hours + " hours ";
      }
      if (mins > 0) {
        timestr += mins + " minutes ";
      }
      if (secs > 0) {
        timestr += secs + " seconds ";
      }
      bot.sendMessage(msg.channel, "Uptime: " + timestr);
    }
  },
  "setregion": {
    usage: "setregion <region>",
    description: "set region",
    process: function(bot, msg, suffix) {
      var region = suffix;
      var role = msg.channel.server.roles.get("name", region);

      if (suffix) {
        removeRegions(msg).then(function() {
          msg.sender.addTo(role, function(err) {
            if (!err) {
              var message = msg.sender + " set to region: " + region;
              bot.sendMessage(msg.channel, message);
            }
          });
          // BUG - doesnt add after 'removal' of existing

        });
      }
    }
  },
  "unsetregion": {
    usage: "unsetregion",
    description: "unset region",
    process: function(bot, msg) {
      removeRegions(msg);
      var message = msg.sender + " region removed.";
      bot.sendMessage(msg.channel, message);
    }
  },
  "set18": {
    usage: "set18",
    description: "sets 18+",
    process: function(bot, msg) {
      setRole(msg, "18+");
    }
  },
  "unset18": {
    usage: "unset18",
    description: "unsets 18+",
    process: function(bot, msg) {
      unsetRole(msg, "18+");
    }
  },
  "setlol": {
    usage: "setlol",
    description: "sets League of Legends",
    process: function(bot, msg) {
      setRole(msg, "lol");
    }
  },
  "unsetlol": {
    usage: "unsetlol",
    description: "unsets League of Legends",
    process: function(bot, msg) {
      unsetRole(msg, "lol");
    }
  },
  "settts": {
    usage: "settts",
    description: "sets TableTopSimulator",
    process: function(bot, msg) {
      setRole(msg, "tts");
    }
  },
  "unsettts": {
    usage: "unsettts",
    description: "unsets TableTopSimulator",
    process: function(bot, msg) {
      unsetRole(msg, "tts");
    }
  },
  "spray": {
    description: "Spray someone thirsty...",
    process: function(bot, msg) {
      bot.sendMessage(msg.channel, "*sprays " + msg.sender + " with the fire hose*");
    }
  },

  "hug": {
    usage: "<user> <message to leave user>",
    description: "hug",
    process: function(bot, msg, suffix) {
      var args = suffix.split(' ');
      var user = args.shift();
      if (suffix) {
        var message = randomFromArray(hugReplies).replace('$USER', user)
        bot.sendMessage(msg.channel, message);
      } else {
        var message = randomFromArray(hugReplies).replace('$USER', msg.sender);
        bot.sendMessage(msg.channel, message);
      }
    }
  },

  "slap": {
    usage: "<user> <message to leave user>",
    description: "slap",
    process: function(bot, msg, suffix) {
      var args = suffix.split(' ');
      var user = args.shift();
      if (suffix) {
        var message = randomFromArray(slapReplies).replace('$USER', user)
        bot.sendMessage(msg.channel, message);
      } else {
        var message = randomFromArray(slapReplies).replace('$USER', msg.sender);
        bot.sendMessage(msg.channel, message);
      }
    }
  },

  "poke": {
    description: "Poke",
    process: function(bot, msg) {
      bot.sendMessage(msg.channel, randomFromArray(pokeReplies));
    }
  },

  "lapdance": {
    description: "Lapdance",
    process: function(bot, msg) {
      if (msg.sender.hasRole(msg.channel.server.roles.get("name", "Admin"))) {
        var message = '*gives $USER a sexy lapdance*';
        bot.sendMessage(msg.channel, message.replace('$USER', msg.sender));
      } else {
        bot.sendMessage(msg.channel, 'NO!');
      }
    }
  }
};



var bot = new Discord.Client();

bot.on("ready", function() {
  console.log("Ready to begin! Serving in " + bot.channels.length + " channels");
  // require("./plugins.js").init();
});

bot.on("disconnected", function() {
  console.log("Disconnected!");
  process.exit(1); //exit node.js with an error

});

bot.on("message", function(msg) {
  //check if message is a command
  if (msg.author.id != bot.user.id && (msg.content[0] === '!' || msg.content.indexOf(bot.user.mention()) == 0)) {
    console.log("treating " + msg.content + " from " + msg.author + " as command");
    var cmdTxt = msg.content.split(" ")[0].substring(1);
    var suffix = msg.content.substring(cmdTxt.length + 2); //add one for the ! and one for the space
    if (msg.content.indexOf(bot.user.mention()) == 0) {
      try {
        cmdTxt = msg.content.split(" ")[1].toLowerCase();
        suffix = msg.content.substring(bot.user.mention().length + cmdTxt.length + 2);
      } catch (e) { //no command
        bot.sendMessage(msg.channel, "Yes?");
        return;
      }
    }
    var cmd = commands[cmdTxt.toLowerCase()];
    if (cmdTxt === "help") {
      //help is special since it iterates over the other commands
      bot.sendMessage(msg.author, "Available Commands:", function() {
        var cmdString = '```\n';
        for (var cmd in commands) {
          var info = "!" + cmd;
          var usage = commands[cmd].usage;
          if (usage) {
            info += "\t" + usage;
          }
          var description = commands[cmd].description;
          if (description) {
            info += "\t" + description;
          }
          cmdString += info + "\n";
        }
        cmdString += "```";
        bot.sendMessage(msg.author, cmdString);
      });
    } else if (cmd) {
      try {
        cmd.process(bot, msg, suffix);
      } catch (e) {
        if (Config.debug) {
          bot.sendMessage(msg.channel, "command " + cmdTxt + " failed :(\n" + e.stack);
        }
      }
    } else {
      if (Config.respondToInvalid) {
        bot.sendMessage(msg.channel, "Invalid command " + cmdTxt);
      }
    }
  } else {
    //message isn't a command or is from us
    //drop our own messages to prevent feedback loops
    if (msg.author == bot.user) {
      return;
    }

    if (msg.author != bot.user && msg.isMentioned(bot.user)) {
      bot.sendMessage(msg.channel, msg.author + ", you called?");
    }
  }
});

// Fires on new member http://discordjs.readthedocs.io/en/latest/docs_client.html#servernewmember
bot.on("serverNewMember", function(server, user) {
  if (user.username) {
    logMessage(bot, "New Member, username:" + user.username + ", id:" + user.id);
    logMessage(bot, user.username + ", Welcome!", "general");
  } else {
    logMessage(bot, "Returning Member, id:" + user.id);
  }
});

// Fires on new member http://discordjs.readthedocs.io/en/latest/docs_client.html#servermemberremoved
bot.on("serverMemberRemoved", function(server, user) {
  logMessage(bot, "Member left (or kicked), username:" + user.username + ", id:" + user.id);
});

// Fires on ban http://discordjs.readthedocs.io/en/latest/docs_client.html#userbanned
bot.on("userBanned", function(user, server) {
  logMessage(bot, "Member banned, username:" + user.username + ", id:" + user.id);
});

// Fires on unban http://discordjs.readthedocs.io/en/latest/docs_client.html#userunbanned
bot.on("userUnbanned", function(user, server) {
  logMessage(bot, "Member unbanned, username:" + user.username + ", id:" + user.id);
});

// Fires on user changes http://discordjs.readthedocs.io/en/latest/docs_client.html#presence
bot.on("presence", function(userOld, userNew) {
  if (userOld.status != userNew.status) {
    // Implied status change
    //logMessage(bot,"user: "+userNew.username+", status: "+userNew.status);
  }
  if (userNew.game) {
    // user is playing a game, null if not http://discordjs.readthedocs.io/en/latest/docs_user.html#game
    //logMessage(bot,"user: "+userNew.username+", is now playing: "+userNew.game.name);
  }
  if (userOld.username != userNew.username) {
    // username change, likely due to rejoin.
    logMessage(bot, "Member rejoined, username: " + userNew.username + ", id: " + userNew.id);
  }
});

exports.addCommand = function(commandName, commandObject) {
  try {
    commands[commandName] = commandObject;
  } catch (err) {
    console.log(err);
  }
}
exports.commandCount = function() {
  return Object.keys(commands).length;
}

bot.loginWithToken(AuthDetails.token);