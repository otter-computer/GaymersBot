var Discord = require("discord.js");
var d20 = require("d20");
var http = require('http');
var URL = require('url');

// Authentication token
var token = process.env.AUTH_TOKEN;
if(!token) {
  console.log("Please set the AUTH_TOKEN environment variable with a token.\n");
  process.exit();
}

// Debug mode
var debug = process.env.APP_DEBUG;
if(!debug) {
  debug = false;
}

var version, versionFull;

try {
  var fs = require('fs')
    , filename = 'version.txt';

  fs.readFile(filename, 'utf8', function(err, data) {
    if (err) { //no version
      version = false;
      versionFull = false;
    }
    else{
      version = data.substring(0, 7);
      versionFull = data;
    }
  });
} 
catch (e) { //no version
  console.log("Could not read version, will not set status.")
  return;
}

var startTime = Date.now();

// Util function to choose a random from array
var randomFromArray = function(array) {
  return array[Math.floor(Math.random() * array.length)];
}

// Util function to convert string to Title Case
String.prototype.toProperCase = function () {
    return this.replace(/\w\S*/g, function(txt){return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();});
};

// Util function that returns a user tag
var tagUser = function(user) {
  return "<@" + user.id + ">";
}

var removeRegions = function(msg, cb) {
  var user = msg.sender;

  var regions = regionRoles(msg);

  user.removeFrom(regions, function(err) {
    if (!err) {
      console.log('Region roles removed for user: ' + user.username);
      cb();
    } else {
      console.log('Error removing region roles for user: ' + user.username, err);
    }

  });
}

var logMessage = function(bot, message, channelname) {
  if (!channelname) {
    channelname = 'user-logs';
  }
  var channel = bot.channels.get("name", channelname);
  bot.sendMessage(channel, message);
}

var setRole = function(msg, rolename) {
  var user = msg.sender;
  var role = msg.channel.server.roles.get("name", rolename);
  var message = "";
  if (!user.hasRole(role)) {
    user.addTo(role);
    message = user + " has been added to " + role.name;
  } else {
    message = user + " already has " + role.name; 
  }
  return message;
}

var unsetRole = function(msg, rolename) {
  var user = msg.sender;
  var role = msg.channel.server.roles.get("name", rolename);
  var message = "";
  if (user.hasRole(role)) {
    user.removeFrom(role);
    message = user + " has been removed from " + role.name;
  } else {
    message = user + " does not have " + role.name;
  }
  console.log("message", message)
  return message;
}

var regionRoles = function(msg) {
  var regionArray = [
    msg.channel.server.roles.get("name", "Europe"),
    msg.channel.server.roles.get("name", "North America"),
    msg.channel.server.roles.get("name", "South America"),
    msg.channel.server.roles.get("name", "Middle East"),
    msg.channel.server.roles.get("name", "Oceania"),
    msg.channel.server.roles.get("name", "Africa"),
    msg.channel.server.roles.get("name", "Asia")
  ];
  
  return regionArray;
}

var getUrlData = function (url,cb){
  var str = '';
  var oURL = URL.parse(url);

  //TODO handle urls passed with a path 
  var options = {
        host: oURL.host,
        path: oURL.path
  };

  callback = function(response) {

    response.on('data', function (chunk) {
      str += chunk;
    });

    response.on('end', function () {
      cb(str);
    });
  }

  var req = http.request(options, callback).end();

}

var welcomeMessage = "Welcome to Gaymers! \n" +
  "type `!help` to see how I work. \n" +
  "To set your region type `!setregion [Your region]` in any channel. \n" +
  "For help on what regions are available type `!regions` in any channel. \n" +
  "To gain access to the #over-18 channel, type `!set18` in any channel. \n" +
  "If you have any questions, use the `@admin` command or PM one of the admins. \n" +
  "Please review our rules here: https://goo.gl/670LtP";
  
var welcomeBackMessage = "Welcome back to Gaymers! \n" +
  "type `!help` to see how I work. \n" +
  "To set your region type `!setregion [Your region]` in any channel. \n" +
  "For help on what regions are available type `!regions` in any channel. \n" +
  "To gain access to the #over-18 channel, type `!set18` in any channel. \n" +
  "If you have any questions, use the `@admin` command or PM one of the admins. \n" +
  "Please remember our rules that are available here: https://goo.gl/670LtP";
  
var regionMessage = "To set your region type `!setregion [Your region]` in any channel. \n" +
  "Here is the list of available regions: \n";

var hugReplies = [
  '\*hugs $USER\*',
  '\*hugs $USER\*',
  '\*hugs $USER\*',
  '\*hugs $USER\*',
  '\*licks $USER\*',
  '\*pounces $USER\*',
  '\*jumps on $USER\*',
  '\*glomps $USER\*',
  '\*falls on $USER\*',
  '\*bear hugs $USER\*',
  '\*tightly squeezes $USER\*',
  '\*embraces $USER\*',
  '\*holds $USER close\*',
  '\*cuddles $USER\*',
  '\*takes $USER into his arms\*'
];

var pokeReplies = [
  'STOP TOUCHING ME!',
  'LEAVE ME ALONE',
  'can I go home now?',
  'It\'s dark in here.. :cold_sweat:',
  'AAAAAAAAAAAAH',
  'NO',
  ':grimacing:',
  ':wink:',
  ':frowning:',
  'h-hello? :cold_sweat:',
  ':point_right::point_left:',
  'Not there! :scream:',
  'A bit lower... :smirk:',
  'WHAT DO YOU WANT?!',
  'bleep :neutral_face: ',
  'Well hello there :smirk:',
  ':flushed: Everybody\'s watching..',
  ':scream:',
  ':wink:',
  'N-nani',
  'Don\'t stop there.',
  'More please :wink:',
  'Only one finger?',
  'Come here :kissing_heart:'
];

var slapReplies = [
  '\*slaps $USER around a bit with a large, girthy trout\* :fish:',
  '\*slaps $USER with a meaty sausage\*'
];

var sprayReplies = [
  "\*sprays $USER with a fire hose.\*"
];

var commands = {
  "ping": {
    usage: "",
    description: "Responds pong, useful for checking if bot is alive.",
    process: function(bot, msg, suffix) {
      bot.sendMessage(msg.channel, msg.sender + " pong!");
    }
  },

"status": {
    usage: "",
    description: "Responds with bot version & build status.",
    process: function(bot, msg) {
      var message = "I am currently running version: "+version+"\n";
      message += "GitHub:\thttps://github.com/gaymers-discord/DiscoBot.js/commit/"+versionFull+"\n";
      message += "Deploy:\thttps://codeship.com/projects/eccc20f0-fd33-0133-86bb-12bea37b94ef/status?branch=master";
      bot.sendMessage(msg.channel, message);
    }
  },

  "roll": {
    usage: "[# of sides] or !roll [# of dice]d[# of sides]",
    description: "Roll one die with x sides, or multiple dice using d20 syntax.",
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
    description: "Returns the amount of time since the bot started.",
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
  
  "regions": {
    usage: "",
    description: "List the available regions.",
    process: function(bot, msg, suffix) {
      var message = regionMessage;
      
      var regions = regionRoles(msg);
          
      for (var i = 0; i < regions.length; i++) {
        if (i === 0) {
          message = message + regions[i].name;
        } else {
          message = message + ", " + regions[i].name;
        }
      }
      
      bot.sendMessage(msg.channel, message);
    }
  },
  
  "setregion": {
    usage: "[Your region]",
    description: "Set your region, get pretty color.",
    process: function(bot, msg, suffix) {
      var region = suffix.toProperCase();
      var role = msg.channel.server.roles.get("name", region);

      if (suffix) {
        removeRegions(msg, function() {
          console.log('adding role');
          msg.sender.addTo(role, function(err) {
            if (!err) {
              var message = msg.sender + " set region to " + region;
              bot.sendMessage(msg.channel, message);
            }
          });
        });
      }
    }
  },
  
  "unsetregion": {
    usage: "",
    description: "Remove your region, remain mysterious.",
    process: function(bot, msg) {
      removeRegions(msg);
      var message = msg.sender + " region removed.";
      bot.sendMessage(msg.channel, message);
    }
  },
  
  "set18": {
    usage: "",
    description: "Gives you the 18+ role, allows access to #over-18.",
    process: function(bot, msg) {
      var message = setRole(msg, "18+");
      bot.sendMessage(msg.channel, message);
    }
  },
  
  "unset18": {
    usage: "",
    description: "Removes the 18+ role.",
    process: function(bot, msg) {
      var message = unsetRole(msg, "18+");
      bot.sendMessage(msg.channel, message);
    }
  },
  
  "setlol": {
    usage: "",
    description: "Gives you the League of Legends role, find others to play with!",
    process: function(bot, msg) {
      var message = setRole(msg, "League of Legends");
      console.log('setlol', message);
      bot.sendMessage(msg.channel, message);
    }
  },
  
  "unsetlol": {
    usage: "",
    description: "Removes the League of Legends role.",
    process: function(bot, msg) {
      var message = unsetRole(msg, "League of Legends");
      console.log(message);
      console.log('unsetlol', message);
      bot.sendMessage(msg.channel, message);
    }
  },
  
  "settts": {
    usage: "",
    description: "Gives you the Table Top Simulator role, find others to play with!",
    process: function(bot, msg) {
      var message = setRole(msg, "Table Top Simulator");
      bot.sendMessage(msg.channel, message);
    }
  },
  
  "unsettts": {
    usage: "",
    description: "Removes the Table Top Simulator role.",
    process: function(bot, msg) {
      var message = unsetRole(msg, "Table Top Simulator");
      bot.sendMessage(msg.channel, message);
    }
  },
  
  "spray": {
    usage: "[@user]",
    description: "Spray someone thirsty...",
    process: function(bot, msg, suffix) {
      var args = suffix.split(' ');
      var user = args.shift();
      if (suffix) {
        var message = randomFromArray(sprayReplies).replace('$USER', user)
        bot.sendMessage(msg.channel, message);
      } else {
        var message = randomFromArray(sprayReplies).replace('$USER', msg.sender);
        bot.sendMessage(msg.channel, message);
      }
    }
  },

  "hug": {
    usage: "[@user]",
    description: "Give someone a hug.",
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
    usage: "[@user]",
    description: "Slap someone.",
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
    usage: "",
    description: "Poke Discobot. :3",
    process: function(bot, msg) {
      bot.sendMessage(msg.channel, randomFromArray(pokeReplies));
    }
  },

  "suggest": {
    usage: "[DiscoBot suggestion]",
    description: "Suggest a new bot feature.",
    process: function(bot, msg, suffix) {
      if (suffix) {
        var message = "Thanks for the suggestion, I've PM'd it to a developer."

        if(!msg.channel.recipient){
          var chan = msg.channel;  
          var devRole = chan.server.roles.get("name", "Bot Developer");
          var devUsers = chan.server.usersWithRole(devRole);

          for (var devUser in devUsers){
            var devMsg = tagUser(msg.sender)+" has suggested: \n```\n"+suffix+"\n```";
            bot.sendMessage(devUsers[devUser], devMsg);
          }
          bot.sendMessage(msg.channel, message);

        }
        else{
          var message = "I cant take suggestions in private, sorry!"
          bot.sendMessage(msg.author, message);
        }
      }
      else {
        var message = "If you have something to say, then say it!"
        bot.sendMessage(msg.channel, message);
      }
    }
  },
  
  "lapdance": {
    usage: "",
    description: "Have a *sexy* lapdance.",
    process: function(bot, msg) {

      // Hax to detect PMs
      if (msg.channel.recipient) {
        bot.sendMessage(msg.channel, "I don't give private shows, you ***freak!***");
      } else if (msg.sender.hasRole(msg.channel.server.roles.get("name", "Admin"))) {
        var message = '*gives $USER a sexy lapdance*';
        bot.sendMessage(msg.channel, message.replace('$USER', msg.sender));
      } else {
        bot.sendMessage(msg.channel, 'NO!');
      }
    }
  },
  
  "playing": {
    usage: "",
    description: "See a list of who's playing what.",
    process: function(bot,msg,suffix) {
      var output = "Currently being played:\n";
      var userList = msg.client.users.getAll("status","online");
      var gamers = "";
      var messages = [];

      for (var i = 0; i < userList.length; i++) {
        var isBot = userList[i].bot;
        var username = tagUser(userList[i]);
        var game = userList[i].game;

        if (gamers.length>1900){
          messages.push(gamers);
          var gamers = "";
        }

          if (!isBot && game) {
            if (suffix){
              var targetGame = suffix.toLowerCase();
              var gameLower = game.name.toLowerCase();

              if (targetGame == gameLower){
                gamers += "\t"+username + " is currently playing "+ game.name+"\n";

              }
            }
            else {
                gamers += "\t"+username + " is currently playing "+ game.name+"\n";
            }
          }
        }

      if (gamers.length==0){
        gamers = "Nobody! :(";
        messages.unshift(gamers);
      }
      else if (gamers.length>0){
        messages.unshift(gamers);
      }

          
      for (var i = 0; i < messages.length; i++) {
        bot.sendMessage(msg.author, messages[i], function(e){
          if(e) {
                console.log(e);
              } 
        });
      }

    }
  },
  
  "choose": {
    usage: "[Option 1] [Option 2] [etc]",
    description: "Let DiscoBot choose for you.",
    process: function(bot,msg,suffix){

    formats = [
      "I think \"%\" is the best choice",
      "I've decided on \"%\"",
      "Definitely \"%\"",
      "\"%\" would be best",
      "After much deliberation, \"%\"",
      "I reckon \"%\"",
      "I choose \"%\""
    ];

    var options = suffix.split(/\s*[ ,;]\s*|\sor\s/i)
    var choice = options[Math.floor(Math.random()*options.length)];
    var format = formats[Math.floor(Math.random()*formats.length)];

    if(msg.channel.recipient){
      // from pm - TODO proper channel distinction
      var to = msg.author;
    }
    else {
      var to = msg.channel
    }

    bot.sendMessage(to, format.replace("%", choice));

    }
  },
  
  "8ball": {
    usage: "[Question]",
    description: "See the future, have DiscoBot read your fortune.",
    process: function(bot,msg,suffix){

      ball = [
        "It is certain",
        "It is decidedly so",
        "Without a doubt",
        "Yes – definitely",
        "You may rely on it",
        "As I see it, yes",
        "Most likely",
        "Outlook good",
        "Signs point to yes",
        "Yes",
        "Reply hazy, try again",
        "Ask again later",
        "Better not tell you now",
        "Cannot predict now",
        "Concentrate and ask again",
        "Don't count on it",
        "My reply is no",
        "My sources say no",
        "Outlook not so good",
        "Very doubtful",
      ];

      var choice = ball[Math.floor(Math.random() * ball.length)];

      if(suffix) {
        if(msg.channel.recipient){
          // from pm - TODO proper channel distinction
          var to = msg.author;
        }
        else {
          var to = msg.channel;
        }
        bot.sendMessage(to, choice);
      }
    }
  },
  
  "avatar": {
    usage: "[@user]",
    description: "See someone's avatar.",
    process: function(bot,msg,suffix){
      if(suffix){
        var users = msg.mentions;

        for (var i = 0; i < users.length; i++) {

          var id = users[i].id;
          var avatar = users[i].avatar;
          var oURL = users[i].mention() + "'s avatar https://discordapp.com/api/users/"+id+"/avatars/"+avatar+".jpg";

          if(msg.channel) {
            bot.sendMessage(msg.channel, oURL);
          }
        }
      }
    }
  },
  
  "joined": {
    usage: "[@user]",
    description: "See when someone joined the server.",
    process: function(bot,msg,suffix){

      if(suffix){
        var users = msg.mentions;

        for (var i = 0; i < users.length; i++) {
          var user = msg.channel.server.detailsOfUser(users[i]);
          var d = new Date(user.joinedAt);
          var message =  tagUser(users[i]) + " joined at " + d;

          if(msg.channel){
            bot.sendMessage(msg.channel, message);
          }
        }
      }
    }
  },
  
  "setsteam": {
    usage: "[Steam ID]",
    description: "Set your Steam ID so others can find you on Steam. (This returns your steam profile URL, so set a custom one!)",
    process: function(bot,msg,suffix){

      if(suffix){
        var user = msg.author.id;
        setUserMeta(user,'steam',suffix);
        bot.sendMessage(msg.channel, 'set your Steam profile id to: ' + suffix);
      }
    }
  },
  
  "getsteam": {
    usage: "@user",
    description: "Gets the Steam ID of a user.",
    process: function(bot, msg, suffix) {
      
      if(!suffix) {
        return; // return early, stop execution.
      }
      
      var users = suffix.split(' ');
      for (var i = 0; i < users.length; i++) {
        
        var id;
        
        // Server nickname detection
        if(users[i].substr(2, 1) === "!") {
          id = users[i].slice(3, users[i].length - 1);
        } else {
          id = users[i].slice(2, users[i].length - 1);
        }
        
        queryUserMeta(id, function(data) {

          var message = "";
          if(data.steam == null) {
            message = "Sorry, I dont have their Steam account. :frowning:";
          }
          else {
            message = "Here's the Steam account for " + tagUser(data) + ":\n" + data.steam;
          }
          if(msg.channel){
            bot.sendMessage(msg.channel, message);
          }
        });
      } 
    }
  },
  
  "setbattlenet": {
    usage: "[BattleTag]",
    description: "Save your Battletag so others can find you on Battle.net",
    process: function(bot,msg,suffix){

      if(suffix){
        var user = msg.author.id;
        setUserMeta(user,'battlenet',suffix);
        bot.sendMessage(msg.channel, 'set your BattleTag to: ' + suffix);
      }
    }
  },
  
  "getbattlenet": {
    usage: "[@user]",
    description: "Gets the Battletag of a user",
    process: function(bot,msg,suffix) {
      
      if(!suffix) {
        return; // return early, stop execution.
      }

      var users = suffix.split(' ');
      
      for (var i = 0; i < users.length; i++) {
        
        var id;
      
        // Server nickname detection
        if(users[i].substr(2, 1) === "!") {
          id = users[i].slice(3, users[i].length - 1);
        } else {
          id = users[i].slice(2, users[i].length - 1);
        }
        
        queryUserMeta(id, function(data) {
          var message = "";
          
          if(data.battlenet == null) {
            message = "Sorry, I dont have their battletag. :frowning:";
          }
          else {
            message = "Here's the BattleTag for " + tagUser(data) + ":\n" +  data.battlenet;
          }
          if(msg.channel) {
            bot.sendMessage(msg.channel, message);
          }
        });
      } 
    }
  },

  "setsummonername": {
    usage: "[Summoner name]",
    description: "Save your summoner name so others can find you on League of Legends.",
    process: function(bot,msg,suffix){

      if(suffix){
        var user = msg.author.id;
        setUserMeta(user,'summonername',suffix);
        bot.sendMessage(msg.channel, 'set your summoner name to: ' + suffix);
      }
    }
  },
  
  "getsummonername": {
    usage: "[@user]",
    description: "Gets the summoner name of a user",
    process: function(bot, msg, suffix) {
      
      if(!suffix) {
        return; // return early, stop execution.
      }
      
      var users = suffix.split(' ');
      
      for (var i = 0; i < users.length; i++) {
        
        var id;
        
        // Server nickname detection
        if(users[i].substr(2, 1) === "!") {
          id = users[i].slice(3, users[i].length - 1);
        } else {
          id = users[i].slice(2, users[i].length - 1);
        }
        
        queryUserMeta(id, function(data) {

          var message = "";
          if(data.summonername == null) {
            message = "Sorry, I dont have their summoner name. :frowning:";
          }
          else {
            message = "Here's the summoner name for " + tagUser(data) + ":\n" +  data.summonername;
          }
          if(msg.channel) {
            bot.sendMessage(msg.channel, message);
          }
        });
      } 
    }
  },
  
  "settwitch": {
    usage: "[Twitch channel ID]",
    description: "Save your Twitch channel so others can watch you stream",
    process: function(bot, msg, suffix) {

      if(suffix){
        var user = msg.author.id;
        setUserMeta(user, 'twitch', suffix);
        bot.sendMessage(msg.channel, 'set your Twitch username to: ' + suffix);
      }
    }
  },
  
  "gettwitch": {
    usage: "[@user]",
    description: "Gets the Twitch username of a user",
    process: function(bot,msg,suffix) {
      
      if(!suffix) {
        return; // return early, stop execution.
      }

      var users = suffix.split(' ');
      
      for (var i = 0; i < users.length; i++) {
        
        var id;
        
        // Server nickname detection
        if(users[i].substr(2, 1) === "!") {
          id = users[i].slice(3, users[i].length - 1);
        } else {
          id = users[i].slice(2, users[i].length - 1);
        }
        
        queryUserMeta(id, function(data) {

          var message = "";
          if(data.twitch == null) {
            message = "Sorry, I dont have their Twitch channel. :frowning:";
          }
          else {
            message = "Here's the Twitch channel for " + tagUser(data) + ":\n" + "https://twitch.tv/" + data.twitch;
          }
          if(msg.channel) {
            bot.sendMessage(msg.channel, message);
          }
        });
      } 
    }
  },
  
  "setyoutube": {
    usage: "[YouTube channel ID]",
    description: "Save your YouTube channel so others can watch your videos",
    process: function(bot, msg, suffix) {

      if(suffix) {
        var user = msg.author.id;
        setUserMeta(user, 'youtube', suffix);
        bot.sendMessage(msg.channel, 'set your YouTube channel to: ' + suffix);
      }
    }
  },
  
  "getyoutube": {
    usage: "@user",
    description: "Gets the YouTube Channel of a user",
    process: function(bot,msg,suffix) {

      if(!suffix) {
        return; // return early, stop execution.
      }
      
      var users = suffix.split(' ');
      
      for (var i = 0; i < users.length; i++) {
        
        var id;
        
        // Server nickname detection
        if(users[i].substr(2, 1) === "!") {
          id = users[i].slice(3, users[i].length - 1);
        } else {
          id = users[i].slice(2, users[i].length - 1);
        }
        
        queryUserMeta(id, function(data) {

          var message = "";
          if(data.youtube == null) {
            message = "Sorry, I dont have their YouTube channel. :frowning:";
          }
          else {
            message = "Here's the YouTube channel for " + tagUser(data) + ":\n" + "https://youtube.com/" + data.youtube;
          }
          if(msg.channel) {
            bot.sendMessage(msg.channel, message);
          }
        });
      } 
    }
  },
  
  "getinfo": {
    usage: "@user",
    description: "Gets all saved account information for a user.",
    process: function(bot, msg, suffix) {

      if(!suffix) {
        return; // return early, stop execution.
      }
      
      var users = suffix.split(' ');
      
      for (var i = 0; i < users.length; i++) {
        
        var id;
        
        // Server nickname detection
        if(users[i].substr(2, 1) === "!") {
          id = users[i].slice(3, users[i].length - 1);
        } else {
          id = users[i].slice(2, users[i].length - 1);
        }
        
        queryUserMeta(id, function(data) {
          var message = "";
          
          if (!data) {
            message = "Sorry, I dont have any info. :frowning:";
          } else {
            message = "User info for " + tagUser(data) + ":";
            
            if (data.steam != null) {
              message = message + "\n" + "Steam ID: " + data.steam;
            }
            
            if (data.battlenet != null) {
              message = message + "\n" + "BattleTag: " + data.battlenet;
            }

            if (data.summonername != null) {
              message = message + "\n" + "League of Legends Summoner Name: " + data.summonername;
            }
            
            if (data.twitch != null) {
              message = message + "\n" + "Twitch: https://twitch.tv/" + data.twitch;
            }
            
            if (data.youtube != null) {
              message = message + "\n" + "Youtube: https://youtube.com/" + data.youtube;
            }
          }
          if (msg.channel) {
            bot.sendMessage(msg.channel, message);
          }
        });
      } 
    }
  },

  "penguin": {
    usage: "",
    description: "Gets a penguin.",
    process: function(bot, msg) {
      getUrlData('http://penguin.wtf',function(data) {
        bot.sendMessage(msg.channel, data);
      });
      
    }
  },

  "cat": {
    usage: "",
    description: "Gets a cat.",
    process: function(bot, msg) {
      getUrlData('http://random.cat/meow',function(data) {
        var jData = JSON.parse(data);
        bot.sendMessage(msg.channel, jData.file);
      });
      
    }
  },
  
  "catfact": {
    usage: "",
    description: "Gets a cat fact!",
    process: function(bot, msg) {
      getUrlData('http://catfacts-api.appspot.com/api/facts?number=1',function(data) {
        var jData = JSON.parse(data);
        bot.sendMessage(msg.channel, jData.facts[0]);
      });
      
    }
  }
};

var queryUserMeta = function(userid, cb) {

// RDS connect - this should be moved to a more modular mechanism
try {
  var mysql = require('mysql');
  var con = mysql.createConnection({
    host     : process.env.RDS_HOSTNAME,
    user     : process.env.RDS_USERNAME,
    password : process.env.RDS_PASSWORD,
    port     : process.env.RDS_PORT,
    database : process.env.RDS_DB_NAME
  });
  con.connect();
}
catch (e) { //no db
  console.log(e);
  console.log("Could connect to database meta data will not be loaded.")
  return;
}
  con.query('SELECT * FROM meta WHERE id = \''+userid+'\'', function(err, rows, fields) {
    if (err) {
      console.log(err);
    }
    if (rows[0]) {
      cb(rows[0]);
    }
    
    con.end();
  });
}

var setUserMeta = function(userid, key, value) {

  // RDS connect - this should be moved to a more modular mechanism
  try {
    var mysql = require('mysql');
    var con = mysql.createConnection({
      host     : process.env.RDS_HOSTNAME,
      user     : process.env.RDS_USERNAME,
      password : process.env.RDS_PASSWORD,
      port     : process.env.RDS_PORT,
      database : process.env.RDS_DB_NAME
    });
    con.connect();
  }
  catch (e) { //no db
    console.log(e);
    console.log("Could connect to database meta data will not be loaded.");
    return;
  }

  var lastSegment = value.split('/').pop();

  con.query('INSERT INTO meta (id,'+key+') VALUES('+userid+',\''+lastSegment+'\') ON DUPLICATE KEY UPDATE `'+key+'`=\''+lastSegment+'\'', function(err, rows, fields) {
    if (err) {
      console.log(err);
    }
   
    con.end();
    return rows;
  });
  
}

var bot = new Discord.Client();

bot.on("ready", function() {
  console.log("Ready to begin! Serving in " + bot.channels.length + " channels");
  // require("./plugins.js").init();

      if(!version) { //no version
        bot.setStatus("online",null,function() {
          console.log("Could not read version, will not set status.");
        });
      }
      else {
        bot.setStatus("online","version: "+version,function() {
          console.log("Status set to: "+version);
        });
      }
});

bot.on("disconnected", function(e) {
  console.log("Disconnected!");
  process.exit(1); //exit node.js with an error

});

bot.on("message", function(msg) {

  // Role to 'ban' users from bot commands.
  var botMute = false;
  if (!msg.channel.recipient && msg.author.id != bot.user.id){
    //console.log(msg.channel);
    //console.log(msg.channel.server);
    muteRole = msg.channel.server.roles.get("name", "Bot Restricted");
    botMute = msg.author.hasRole(muteRole);
  }
  
  if (!botMute){

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
          var cmdArray = [];
          var cmdString = '```';
          for (var cmd in commands) {
            
            var info = "!" + cmd;
            var usage = commands[cmd].usage;
            if (usage) {
              info += " " + usage;
            }
            var description = commands[cmd].description;
            if (description) {
              info += " - " + description;
            }
            
            if((cmdString.length + info.length)<1900){
              cmdString += info + "\n";
            }
            else{
              cmdString += "```";
              cmdArray.push(cmdString);
              cmdString = "```"; //reset
              cmdString += info + "\n";
            }

          }
          cmdString += "```";
          cmdArray.push(cmdString);
          
          for (var i = 0; i < cmdArray.length; i++) {
            bot.sendMessage(msg.author, cmdArray[i], function(e){
              if(e) {
                    console.log(e);
                  } 
            });
          }
        });
      } else if (cmd) {
        try {
          cmd.process(bot, msg, suffix);
        } catch (e) {
          if (debug) {
            bot.sendMessage(msg.channel, "command " + cmdTxt + " failed :(\n" + e.stack);
          }
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
  }
});

// Fires on new member http://discordjs.readthedocs.io/en/latest/docs_client.html#servernewmember
bot.on("serverNewMember", function(server, user) {
  if (user.username) {
    logMessage(bot, tagUser(user) + " joined the server.");
    logMessage(bot, "Welcome, " + tagUser(user) + "!", "general");
    bot.sendMessage(user, welcomeMessage);
  }
});

// Fires on new member http://discordjs.readthedocs.io/en/latest/docs_client.html#servermemberremoved
bot.on("serverMemberRemoved", function(server, user) {
  logMessage(bot, tagUser(user) + " left the server.");
});

// Fires on ban http://discordjs.readthedocs.io/en/latest/docs_client.html#userbanned
bot.on("userBanned", function(user, server) {
  logMessage(bot, tagUser(user) + " was banned from the server.");
});

// Fires on unban http://discordjs.readthedocs.io/en/latest/docs_client.html#userunbanned
bot.on("userUnbanned", function(user, server) {
  logMessage(bot, tagUser(user) + " was unbanned from the server.");
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
  if (userOld.username != userNew.username && userOld.username === undefined) {
    // username change, likely due to rejoin.
    logMessage(bot, tagUser(userNew) + " rejoined the server");
    logMessage(bot, "Welcome back, " + tagUser(userNew) + "!", "general");
    bot.sendMessage(userNew, welcomeBackMessage);
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

bot.loginWithToken(token);