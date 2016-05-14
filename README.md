# DiscordBot
A chat bot for discord app based off <a href="https://github.com/hydrabolt/discord.js/">discord.js</a>

# Features:
Use !help to get a full list of available commands

# Installation

This bot is written to run on top of node.js. Please see https://nodejs.org/en/download/

Once you have node installed running `npm install` from the bot directory should install all the needed packages. If this command prints errors the bot won't work!

## Windows Users
Please note that you must have a working C compiler and Python in your path for
`npm install` to work. The bot has been tested to work on Windows using Visual Studio 2015 Community and Python 2.7, except for `!pullanddeploy`.
* [Installing Node on Windows](http://blog.teamtreehouse.com/install-node-js-npm-windows)
* [npm errors on Windows](http://stackoverflow.com/questions/21365714/nodejs-error-installing-with-npm)
* [Visual Studio Community 2015](https://www.visualstudio.com/en-us/products/visual-studio-community-vs.aspx)
* [Python 2.7](https://www.python.org/downloads/)

# Running
Before first run you will need to create an `auth.json` file. The token for a discord bot user are required. The token can be generated from the [Discord Developer Site](https://discordapp.com/developers/applications/me). See `auth.json.example`.

*Important*
- Your application must be converted to a 'Bot User' to generate a token
- To invite your bot to your server you need the "Client/Application ID" and replace it in the following url https://discordapp.com/oauth2/authorize?client_id=APP_ID_HERE&scope=bot

To start the bot just run
`node discord_bot.js`.

# Updates
If you update the bot, please run `npm update` before starting it again. If you have
issues with this, you can try deleting your node_modules folder and then running
`npm install` again. Please see [Installation](#Installation).

# ToDo:
All the things!
