DiscoBot
========

The bot that helps run the Gaymers Discord. It handles welcoming users,
changing user roles, logging, and various tomfoolery in chat.

Features
--------

### Commands
- avatar: See someone's avatar.
- boop: BOOP
- choose: Let DiscoBot choose for you.
- help: See what commands I can run!
- hug: Give someone a hug :blush:
- joined: See when someone joined the server.
- magic8ball: See the future, have DiscoBot read your fortune.
- regions: Lists all available regions for use with the !setregion command.
- role: Set or remove a role from yourself.
- set18: Gives you the 18+ role, allows access to #over-18 and #over-18-text.
- setregion: Set your region, get pretty color.
- slap: Slap someone that deserves it.
- spray: Spray someone thirsty...
- unset18: Removes the 18+ role.
- unsetregion: Remove your region, remain mysterious.

### Events
- memberBanned: Logs a member being banned in #user-logs.
- memberJoined: Welcomes a user in #welcome-room, logs them joining
  in #user-logs, and sends them a welcome PM.
- memberLeft: Logs a member leaving in #user-logs.
- memberUnbanned: Logs a member being unbanned in #user-logs.
- memberUpdated: Welcomes a user in #general when the obtain the 'Member' role.
- messageDeleted: Logs a deleted message in #user-logs.
- messageUpdated: Logs a message edit in #user-logs.

Requirements
------------

- node.js
- Discord Bot Account
- Firebase Database

Running
-------

Run `npm install` to install required dependencies.

You will need to set the `AUTH_TOKEN` environment variable in order to run the
bot locally. You can create one of these
[here](https://discordapp.com/developers/applications/me). The application must
be created as a 'Bot User' and invited to your test server following the
instructions in the Discord docs.

You will also need to set the following Firebase environment variables in
order to test saving to the database.
```
  FIREBASE_API
  FIREBASE_AUTH_DOMAIN
  FIREBASE_DATABASE_URL
  FIREBASE_STORAGE_BUCKET
```
These can be generated from the
[Firebase console](https://console.firebase.google.com/).

Finally, you can set the `APP_DEBUG` environment variable to `'true'` to
ensure you get a few extra logging messages to the console.

After adding these, run `npm start` to run the bot.
