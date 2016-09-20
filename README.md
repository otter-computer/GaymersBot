# DiscoBot
A chat bot for discord app built with [discord.js](https://github.com/hydrabolt/discord.js/).

## Features:
### Commands
- avatar: See someone's avatar.
- cat: Gets a random cat picture.
- choose: Let DiscoBot choose for you.
- dog: Gets a random cat picture.
- getinfo: Gets user's saved info from the database
- help: See what commands I can run!
- hug: Give someone a hug :blush:
- joined: See when someone joined the server.
- magic8ball: See the future, have DiscoBot read your fortune.
- penguin: Gets a random penguin picture.
- role: Set or remove a role from yourself.
- set18: Gives you the 18+ role, allows access to #over-18 and #over-18-text.
- setinfo: Save your gamertag/username for any gaming service to the database.
- setregion: Set your region, get pretty color.
- slap: Slap someone that deserves it.
- spray: Spray someone thirsty...
- unset18: Removes the 18+ role.
- unsetinfo: Delete a gamertag/username, or all your saved data.
- unsetregion: Remove your region, remain mysterious.

### Events
- memberBanned: Logs a member being banned in #user-logs.
- memberJoined: Welcomes a user to the chat, logs them joining in #user-logs, sends them a welcome PM.
- memberLeft: Logs a member leaving in #user-logs.
- memberUnbanned: Logs a member being unbanned in #user-logs.
- memberUpdated: Logs a username change in #user-logs.
- messageDeleted: Logs a deleted message in #user-logs.
- messageUpdated: Logs a message edit in #user-logs.


## Requirements
- node.js

## Running
Run `npm install` to install required dependancies.

You will need to set the `AUTH_TOKEN` environment variable in order to run the bot locally. You can create one of these [here](https://discordapp.com/developers/applications/me). The application must be created as a 'Bot User'and invited to your test server following the instructions in the Discord docs.

You will also need to set the following Firebase environment variables in order to test saving to the database.
```
  FIREBASE_API
  FIREBASE_AUTH_DOMAIN
  FIREBASE_DATABASE_URL
  FIREBASE_STORAGE_BUCKET
```
These can be generated from the [Firebase console](https://console.firebase.google.com/).

Finally, you can set the `APP_DEBUG` environment variable to `'true'` to ensure you get a few extra logging messages to the console.

After adding these, run `npm start` to run the bot.
