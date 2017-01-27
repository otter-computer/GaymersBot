const request = require('request');


function postData(gameData) {

  request.post(
      'https://api.gaymers.gg/stats',
      { json: gameData },
      function (error, response, body) {
          if (!error && response.statusCode == 200) {
              console.log(body);
          }
          else {
           console.log(error) ;
          }
      }
  );


}

function updateStatus(oldMember, newMember) {

  if( oldMember.game && newMember.game ){
    
    oldGameData = {
      "userid" : newMember.id,
      "game": oldMember.game.name + " - STOPPED"
    };

    newGameData = {
      "userid" : newMember.id,
      "game": newMember.game.name
    };

    postData(oldGameData);
    postData(newGameData);

  }
  else if ( !newMember.game ) {

    gameData = {
          "userid" : oldMember.id,
          "game": oldMember.game.name + " - STOPPED"
        };
    postData(gameData);

  }
  else {
    gameData = {
      "userid" : newMember.id,
      "game": newMember.game.name
    };
    postData(gameData);
  }


}

module.exports = {
  process: (bot, oldMember, newMember) => {

    if (oldMember.game == newMember.game) return;

    updateStatus(oldMember, newMember);

  }
};
