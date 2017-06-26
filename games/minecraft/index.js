const commands = {};

commands.admin = require('./admin');
commands.register = require('./register');
commands.deregister = require('./deregister');
commands.whois = require('./whois');

module.exports.commands = commands;

module.exports.name = 'minecraft';
