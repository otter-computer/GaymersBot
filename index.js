var Discord = require('discord.io');
var fs = require('fs');
// var http = require('http');
// var URL = require('url');
// var cron = require('node-cron');
var moment = require('moment-timezone');
// var d20 = require("d20");

// Discord auth token
var token = process.env.AUTH_TOKEN;

if(!token) {
  console.log("Please set the AUTH_TOKEN environment variable. \n");
  process.exit();
}

// Debug mode
var debug = false;

if(process.env.APP_DEBUG) {
  debug = true;
}

// Bot version
var version, versionFull;

try {
  var filename = 'version.txt';

  fs.readFile(filename, 'utf8', function(err, data) {
    if(err) {
      version = false;
      versionFull = false;
    } else {
      version = data.substring(0, 7);
      versionFull = data;
    }
  })
}
catch (e) {
  console.log("Couldn't read version, won't set status");
}

// Start time
var startTime = Date.now();

// Moment Setup
var momentFormat = "dddd, MMMM Do, HH:mm";

// Bot
var bot = new Discord.Client({
  token: token,
  autorun: true
});

bot.on("ready", function() {
  console.log("DiscoBot ready!");
});

bot.on("disconnected", function() {
  console.log("DiscoBot disconnected :( Attempting to reconnect...");
  try {
    bot.connect(); // Reconnect
  }
  catch (e) {
    process.exit(1); // Exit node.js with an error
  }
});

bot.on("message", function(user, userID, channelID, message, event) {
  if(message === "ping") {
    bot.sendMessage({
      to: channelID,
      message: "pong"
    });
  }
});
