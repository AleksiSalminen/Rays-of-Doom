
const fs = require("fs");
const config = require("../../def/config/config.json");

const Player = require("./objects/characters/player");
const Enemy = require("./objects/characters/enemy");
const Firearm = require("./objects/weapons/firearm");
const MeleeWeapon = require("./objects/weapons/melee_weapon");
const Level = require("./objects/world/level.js");


function createWeapons(config) {
  const baton = config.melee[0];
  const pistol = config.firearms[0];

  let weapons = [];

  weapons.push(new MeleeWeapon(
    baton.type, baton.name, baton.fpsImg, baton.damage, 
    baton.cooldown, baton.cooldownTimer, baton.reach
  ));

  weapons.push(new Firearm(
    pistol.type, pistol.name, pistol.fpsImg, pistol.damage,
    pistol.cooldown, pistol.cooldownTimer, pistol.clipSize,
    pistol.ammo, pistol.clipAmmo, pistol.bulletSpeed,
    pistol.reloadCoolDown, pistol.reloadCoolDownTimer
  ));

  return weapons;
}

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

  createPlayer(config, playerInfo, level) {
    let player;
    let weapons = createWeapons(config.weapons);

    player = new Player(
      playerInfo.client,
      playerInfo.name,
      playerInfo.number,
      config.players.maxHealth,
      config.players.maxHealth,
      config.players.walkSpeed,
      config.players.turnSpeed,
      {
        x: level.playerSpawn.x,
        y: level.playerSpawn.y,
        rotation: 0
      },
      config.players.height,
      config.players.width,
      weapons,
      weapons[0],
      []
    );

    return player;
  },

  createEnemies(config) {
    let enemies = [];

    let enemy;
    let enemyCount = 3;
    for (let i = 0;i < enemyCount;i++) {
      enemy = new Enemy(
        config[0].name, config[0].maxHP, config[0].hp, config[0].walkSpd, 
        {x:2,y:2+i}, config[0].height, config[0].width,
        config[0].pathUpdateDelay, config[0].pathUpdateTimer
      );
      enemies.push(enemy);
    }

    return enemies;
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
  },

  checkIfMeleeHitPlayer(player, players) {
    let hitPlayer;

    function calcDistance(x1, y1, x2, y2) {
      return Math.sqrt(Math.abs( Math.pow(x2-x1,2) + Math.pow(y2-y1,2) ));
    }

    const weapon = player.currentWeapon;
    let otherPlayer;
    let distance = 0;
    for (let plI = 0;plI < players.length;plI++) {
      otherPlayer = players[plI];
      if (player.number !== otherPlayer.number) {
        distance = calcDistance(player.pos.x, player.pos.y, otherPlayer.pos.x, otherPlayer.pos.y);
        if (distance <= weapon.reach) {
          hitPlayer = otherPlayer;
          plI = players.length;
        }
      }
    }

    return hitPlayer;
  }

};
