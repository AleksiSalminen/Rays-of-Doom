
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
    for (let i = 0; i < config.levels.length; i++) {
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

    function checkIfPointIsBetween(oldX, oldY, endX, endY, plX, plY) {
      let isBetween = false;
      if (endX >= oldX && plX <= endX && plX >= oldX) {
        if (endY >= oldY && plY <= endY && plY >= oldY) {
          isBetween = true;
        }
        else if (endY < oldY && plY >= endY && plY <= oldY) {
          isBetween = true;
        }
      }
      else if (endX < oldX && plX >= endX && plX <= oldX) {
        if (endY >= oldY && plY <= endY && plY >= oldY) {
          isBetween = true;
        }
        else if (endY < oldY && plY >= endY && plY <= oldY) {
          isBetween = true;
        }
      }
      return isBetween;
    }

    function calcPlayerDistFromBulletLine(startX, startY, endX, endY, plX, plY) {
      const numerator = Math.abs((endX - startX) * (startY - plY) - (startX - plX) * (endY - startY));
      const denominator = Math.sqrt(Math.pow(endX - startX, 2) + Math.pow(endY - startY, 2));
      return numerator / denominator;
    }

    let otherPlayer;
    let distanceFromLine;
    for (let plI = 0; plI < players.length; plI++) {
      otherPlayer = players[plI];
      if (otherPlayer.number !== player.number
        && checkIfPointIsBetween(oldX, oldY, bullet.x, bullet.y, otherPlayer.pos.x, otherPlayer.pos.y)) {
        distanceFromLine = calcPlayerDistFromBulletLine(oldX, oldY, bullet.x, bullet.y, otherPlayer.pos.x, otherPlayer.pos.y);
        if (distanceFromLine <= otherPlayer.width / 2) {
          hitPlayer = otherPlayer;
          plI = players.length;
        }
      }
    }

    return hitPlayer;
  },

  checkIfBulletHitWall(bullet, walls, dimensions) {
    let hitWall;

    let x = Math.floor(bullet.x);
    let y = Math.floor(bullet.y);
    let width = dimensions.width;
    if (walls[width * y + x] !== 0) {
      hitWall = width * y + x;
    }

    return hitWall;
  }

};
