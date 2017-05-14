DiscoBot
========

The bot that helps run the Gaymers Discord. It handles welcoming users,
changing user roles, logging, and various tomfoolery in chat.

Features
--------

### Commands
- avatar: See someone's avatar.
- boop: BOOP!
- choose: Let DiscoBot choose for you.
- event: Sign up to a server event!
- events: List upcoming server events.
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
- memberJoined: Welcomes a user in #general, logs them joining
  in #user-logs, and sends them a welcome PM.
- memberLeft: Logs a member leaving in #user-logs.
- memberUnbanned: Logs a member being unbanned in #user-logs.
- memberUpdated: Logs nickname changes, restrictions.
- messageDeleted: Logs a deleted message in #user-logs.
- messageUpdated: Logs a message edit in #user-logs.

Requirements
------------

- node.js
- Discord Bot Account
- [AWS](https://aws.amazon.com/) account

Running
-------

Run `npm install` to install required dependencies.

### Discord Auth Token

You will need to set the `AUTH_TOKEN` environment variable in order to run the
bot locally. You can create one of these
[here](https://discordapp.com/developers/applications/me). The application must
be created as a 'Bot User' and invited to your test server following the
instructions in the Discord docs.

### AWS SQS

> SQS is now an optional component within the bot, you can either specify USE_AWS_SQS as false in the config, or simply leave SQS_QUEUE blank.

The bot makes use of Amazon's Simple Queue Service to run certain tasks. In order to set this up you will need to create an SQS queue from the AWS developer console. You can then add the `SQS_QUEUE` environment variables with the URLs generated from AWS.

From there you need to create a new user in AWS IAM. You need to assign that user Read and Write permissions to SQS. Then you can generate an access key to fill the `SQS_ACCESS_KEY` environment variable, and a secret key to fill `SQS_SECRET_KEY`.


After adding these, run `npm start` to run the bot.
