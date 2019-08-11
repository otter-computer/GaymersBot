// Util function to convert string to Title Case
String.prototype.toProperCase = function () {
  return this.replace(/\w\S*/g, function(txt){return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();});
};

// Util function to choose a random from array
// Due to the logic of iterating over arrays and including this proto, I have disabled it
// Offending code lives here https://github.com/hydrabolt/discord.js/blob/master/src/structures/interfaces/TextBasedChannel.js#L94

/*Array.prototype.random = function() {
  return this[Math.floor(Math.random() * this.length)];
};
*/
