const commands = {};
commands.api = require('./api');
commands.register = require('./register');
commands.deregister = require('./deregister');

module.exports.commands = commands;

module.exports.name = 'minecraft';
