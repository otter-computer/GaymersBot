const https = require('https');

function postData(gameData) {
  console.log('Sending data');
  const options = {
    host: 'api.gaymers.gg',
    path: '/stats',
    method: 'POST',
  };

  const request = https.request(options, (response) => {
    response.on('data', (body) => {
      console.log('Data sent');
    });
  });

  request.write(JSON.stringify(gameData));
  request.end();
}


function gameUpdated(oldMember, newMember) {

  const oldGame = oldMember.presence.game;
  const newGame = newMember.presence.game;

  // User starts a game
  if (!oldGame && newGame) {
    const gameData = {
      'userid': newMember.id,
      'game': newGame.name,
      'playing': 1
    };

    console.log('Starting game');
    postData(gameData);
  }

  // User ends a game
  if (oldGame && !newGame) {
    const gameData = {
      'userid': oldMember.id,
      'game': oldGame.name,
      'playing': 0
    };

    console.log('Ending game');
    postData(gameData);
  }

  // User changes game
  if (oldGame && newGame && oldGame !== newGame) {
    const oldGameData = {
      'userid': newMember.id,
      'game': oldGame.name,
      'playing': 0
    };

    const newGameData = {
      'userid': newMember.id,
      'game': newGame.name,
      'playing': 1
    };

    console.log('Changing game');
    postData(oldGameData);
    postData(newGameData);
  }
}

module.exports = {
  process: (bot, oldMember, newMember) => {

    // Game started/stopped
    if (oldMember.presence.game !== newMember.presence.game) {
      gameUpdated(oldMember, newMember);
    }
  }
};
