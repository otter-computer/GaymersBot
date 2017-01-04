Command Reference
=================

This documents how commands work in DiscoBot and the available features for
command development.

Command Definitions
-------------------

Command scripts are located in the `commands/` folder. Once you've created a
script, you can include it in the command list in `index.js` as such:

```javascript
commands.testcommand = require('./commands/testcommand');
```

A minimal command looks like this:

```javascript
module.exports = {
    usage: '',
    description: 'Messages the sender with \'Hello world!\'',
    process: (bot, message) => {
        message.reply('Hello world!');
    }
}
```
...and in `index.js`...
```javascript
commands.helloworld = require('./commands/helloworld');
```

The actual command name is defined by setting the name within the `commands`
table in `index.js`, so `commands.example = [...]` would define the `!example`
command.

See below for what the `usage` and `description` fields do.

Command Object Fields
---------------------

### `.usage` (string)
This is the help text for how to use the command. This is used by `!help` to
document the command parameters. If you have a command that works on a user,
you might set `usage: '[@user]'`.

### `.description` (string)
This is a brief description of what this command does. It should probably be
no more than one sentence. It's shown in the `!help` output.

### `.allowDM` (boolean, default: `false`)
This defines if the command can be used in a DM. If this is set to `true` the
command is processed in DMs. Be wise when allowing use in DMs since you won't
have a server context and no concept of permissions.

### `.requireRoles` (Array of strings)
If this is defined, the user running the command must have a role in the list
in order to use the command. An example is to set `requireRoles: ['Admin']`
for an Admin-only command. A user will get a failure message if they try to
run a command without any of the needed roles.

### `.onlyIn` (Array of strings)
If this is defined, the command can only be used in the channel names listed
here. If a user uses the command elsewhere, their message will deleted and they
will be sent a DM letting them know where they *are* allowed to use the command.
Creation of this message respects the 'READ_MESSAGES' permission and won't tell
the user about a channel they don't have read rights on.

Order of Permission Checks
--------------------------

This is the order of checks that a user is allowed to use a command:
- Is the incoming message from a bot? If so, ignore it.
- Is the message a DM and doesn't have `allowDM: true`? Ignore it.
- If the message is on a server:
  - Does the bot require roles to be used? If so, does the user have one of the
    required roles?
  - Does the command have `onlyIn` set? If so, are we in one of those channels?
  - Does the command have `requiredRoles` set? If so, does the user have one of
    those roles?
