// Util function to convert string to Title Case
String.prototype.toProperCase = function () {
  return this.replace(/\w\S*/g, function(txt){return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();});
};

// Util function to choose a random from array
Array.prototype.random = function() {
  return this[Math.floor(Math.random() * this.length)];
};
