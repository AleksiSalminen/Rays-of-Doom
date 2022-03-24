
const fs = require("fs");
const config = require("../../def/config/config.json");

const Level = require("./objects/level.js");

module.exports = {

  makeid(length) {
    let result = "";
    let characters =
      "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    let charactersLength = characters.length;
    for (let i = 0; i < length; i++) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
  },

  getDataFromFile(fileName) {
    return fs.readFileSync(fileName, "utf8");
  },

  createLevels() {
    let levels = [];

    let level;
    let name;
    for (let i = 0;i < config.levels.length;i++) {
      name = config.levels[i];
      level = new Level(
        name + ".json", 
        {}, 
        {}
      );
      levels.push(level);
    }

    return levels;
  },

  checkIfBulletHitPlayer(oldX, oldY, bullet, player, players) {
    let hitPlayer = undefined;

    function calcPlayerDistFromBulletLine(startX, startY, endX, endY, plX, plY) {
      const numerator = Math.abs( (endX-startX)*(startY-plY) - (startX-plX)*(endY-startY) );
      const denominator = Math.sqrt( Math.pow(endX-startX,2) + Math.pow(endY-startY,2) );
      return numerator/denominator;
    }

    let otherPlayer;
    let distanceFromLine;
    for (let plI = 0;plI < players.length;plI++) {
      otherPlayer = players[plI];
      if (otherPlayer.number !== player.number) {
        distanceFromLine = calcPlayerDistFromBulletLine(oldX, oldY, bullet.x, bullet.y, otherPlayer.pos.x, otherPlayer.pos.y);
        if (distanceFromLine <= otherPlayer.width/2) {
          hitPlayer= otherPlayer;
          plI = players.length;
        }
      }
    }

    return hitPlayer;
  }

};
