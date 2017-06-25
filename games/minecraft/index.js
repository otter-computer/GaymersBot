const commands = {};
commands.api = require('./api');
commands.register = require('./minecraft_register');
commands.deregister = require('./minecraft_deregister');

module.exports.commands = commands;
