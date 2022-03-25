const { io } = require('./handler');
const config = require("../../def/config/config.json");
const helpers = require("./helpers");

const Bullet = require("./objects/weapons/bullet");

let state = {};
let clientRooms = {};

const LEVELS = helpers.createLevels();


module.exports = {

  /**
   * 
   */
  createNewGame(client, params) {
    let roomName = helpers.makeid(5);
    clientRooms[client.id] = roomName;

    state[roomName] = {
      status: "Lobby",
      players: [
        {
          client: client.id,
          name: params.name,
          number: 1
        }
      ]
    };

    client.join(roomName);
    client.number = 1;
    client.emit("lobby", client.number, roomName, state[roomName]);
  },

  /**
   * 
   */
  joinGame(client, params) {
    const roomName = params.code
    const room = io.sockets.adapter.rooms[roomName];

    let allUsers;
    if (room) {
      allUsers = room.sockets;
    }

    let numClients = 0;
    if (allUsers) {
      numClients = Object.keys(allUsers).length;
    }

    if (numClients === 0) {
      client.emit("unknownCode");
      return;
    }
    else if (numClients > config.system.maxNumberOfPlayers - 1) {
      client.emit("tooManyPlayers");
      return;
    }
    else if (state[roomName].status === "Playing") {
      client.emit("gameHasStarted");
      return
    }

    clientRooms[client.id] = roomName;

    client.join(roomName);
    client.number = numClients + 1;

    const playerAmount = state[roomName].players.length;
    state[roomName].players.push({
      client: client.id,
      name: params.name,
      number: state[roomName].players[playerAmount - 1].number + 1
    });

    emitLobbyState(roomName, state[roomName]);
  },

  /**
   * 
   */
  launchGame(client, params) {
    const roomName = clientRooms[client.id];
    if (!roomName) {
      return;
    }

    const level = LEVELS[0];

    let stateCurrent = state[roomName];
    for (let i = 0; i < stateCurrent.players.length; i++) {
      stateCurrent.players[i] = helpers.createPlayer(config, stateCurrent.players[i], level);
    }

    state[roomName].enemies = helpers.createEnemies(config.enemies);

    state[roomName].level = level;
    state[roomName].ui = config.ui;
    state[roomName].status = "Playing";

    emitGameLaunch(roomName, state[roomName]);
    startGameInterval(roomName);
  },

  /**
   * 
   * @param {*} client 
   * @param {*} params 
   */
  removeClient(client, params) {
    const roomName = clientRooms[client.id];
    if (!roomName) {
      return;
    }

    for (let i = 0; i < state[roomName].players.length; i++) {
      let player = state[roomName].players[i];
      if (player.client === client.id) {
        state[roomName].players.splice(i, 1);
        i = state[roomName].players.length;
      }
    }

    if (state[roomName].status === "Lobby") {
      emitLobbyState(roomName, state[roomName]);
    }
  },

  /**
   * 
   * @param {*} params 
   */
  movePlayer(client, params) {
    const roomName = clientRooms[client.id];
    if (!roomName) {
      return;
    }

    let stateCurrent = state[roomName];
    for (let i = 0; i < stateCurrent.players.length; i++) {
      let character = stateCurrent.players[i];
      if (character.getNumber() === params.number
        && character.hp > 0) {
        let newPlayerPos = JSON.parse(JSON.stringify(character.getPosition()));
        let rotated = false;

        const playerSpeed = config.players.walkSpeed;
        if (params.dir === "Forward") {
          newPlayerPos.x = newPlayerPos.x + Math.sin(newPlayerPos.rotation + Math.PI / 2) * playerSpeed;
          newPlayerPos.y = newPlayerPos.y - Math.cos(newPlayerPos.rotation + Math.PI / 2) * playerSpeed;
        }
        else if (params.dir === "Back") {
          newPlayerPos.x = newPlayerPos.x + Math.sin(newPlayerPos.rotation - Math.PI / 2) * (playerSpeed / 2);
          newPlayerPos.y = newPlayerPos.y - Math.cos(newPlayerPos.rotation - Math.PI / 2) * (playerSpeed / 2);
        }
        else if (params.dir === "Left") {
          newPlayerPos.x = newPlayerPos.x + Math.sin(character.pos.rotation) * (playerSpeed / 2);
          newPlayerPos.y = newPlayerPos.y - Math.cos(character.pos.rotation) * (playerSpeed / 2);
        }
        else if (params.dir === "Right") {
          newPlayerPos.x = newPlayerPos.x - Math.sin(character.pos.rotation) * (playerSpeed / 2);
          newPlayerPos.y = newPlayerPos.y + Math.cos(character.pos.rotation) * (playerSpeed / 2);
        }
        else if (params.dir === "RotLeft") {
          if (params.movementX) {
            newPlayerPos.rotation = newPlayerPos.rotation + params.movementX / 150;
          }
          else {
            newPlayerPos.rotation = newPlayerPos.rotation - config.players.turnSpeed;
          }

          if (newPlayerPos.rotation < 0) {
            newPlayerPos.rotation = 2 * Math.PI + newPlayerPos.rotation;
          }
          else if (newPlayerPos.rotation > 2 * Math.PI) {
            newPlayerPos.rotation -= 2 * Math.PI;
          }
          rotated = true;
        }
        else if (params.dir === "RotRight") {
          if (params.movementX) {
            newPlayerPos.rotation = newPlayerPos.rotation + params.movementX / 150;
          }
          else {
            newPlayerPos.rotation = newPlayerPos.rotation + config.players.turnSpeed;
          }

          if (newPlayerPos.rotation < 0) {
            newPlayerPos.rotation = 2 * Math.PI + newPlayerPos.rotation;
          }
          else if (newPlayerPos.rotation > 2 * Math.PI) {
            newPlayerPos.rotation -= 2 * Math.PI;
          }
          rotated = true;
        }

        let hitWall = false;
        let playerTileLoc = Math.floor(newPlayerPos.y) * stateCurrent.level.dimensions.width + Math.floor(newPlayerPos.x);
        if (stateCurrent.level.getWalls()[playerTileLoc] !== 0) {
          hitWall = true;
        }

        if (!hitWall) {
          if (!rotated) {
            character.moving = true;
          }
          state[roomName].players[i].setPosition(newPlayerPos);
        }
        i = stateCurrent.players.length;
      }
    }

  },

  /**
   * 
   * @param {*} client 
   * @param {*} params 
   */
  attack(client, params) {
    const roomName = clientRooms[client.id];
    if (!roomName) {
      return;
    }

    let stateCurrent = state[roomName];
    for (let i = 0; i < stateCurrent.players.length; i++) {
      let player = stateCurrent.players[i];
      if (player.number === params.number
        && player.hp > 0) {
        const weapon = player.currentWeapon;
        if (weapon.type === "Melee") {
          if (weapon.cooldownTimer === weapon.cooldown) {
            console.log("HAWOOSH!");
            weapon.cooldownTimer = 0;
            let hitPlayer = helpers.checkIfMeleeHitPlayer(player, stateCurrent.players);
            if (hitPlayer) {
              console.log("OUCHIE! Hit player: " + hitPlayer.name);
            }
          }
        }
        else if (weapon.type === "Firearm") {
          if (weapon.clipAmmo > 0 && weapon.cooldownTimer === weapon.cooldown) {
            console.log("POW!");

            weapon.cooldownTimer = 0;

            const bullet = new Bullet(
              player.pos.x,
              player.pos.y,
              weapon.bulletSpeed,
              player.pos.rotation,
              weapon.damage
            );

            weapon.clipAmmo = weapon.clipAmmo - 1;

            player.bullets.push(bullet);
          }
        }
      }
    }
  },

  /**
   * 
   */
  reload(client, params) {
    const roomName = clientRooms[client.id];
    if (!roomName) {
      return;
    }

    let stateCurrent = state[roomName];
    for (let i = 0; i < stateCurrent.players.length; i++) {
      let player = stateCurrent.players[i];
      if (player.getNumber() === params.number
        && player.hp > 0) {
        const weapon = player.currentWeapon;
        if (weapon.type === "Firearm") {
          if (weapon.reloadCoolDownTimer === weapon.reloadCoolDown
            && weapon.ammo > 0 && weapon.clipAmmo < weapon.clipSize) {
            weapon.reloadCoolDownTimer = 0;
            if (weapon.ammo >= weapon.clipSize - weapon.clipAmmo) {
              weapon.ammo = weapon.ammo - (weapon.clipSize - weapon.clipAmmo);
              weapon.clipAmmo = weapon.clipSize;
            }
            else {
              weapon.clipAmmo = weapon.clipAmmo + weapon.ammo;
              weapon.ammo = 0;
            }
          }
        }
      }
    }
  },

  /**
   * 
   */
  changeWeapon(client, params) {
    const roomName = clientRooms[client.id];
    if (!roomName) {
      return;
    }

    let stateCurrent = state[roomName];
    for (let i = 0; i < stateCurrent.players.length; i++) {
      let player = stateCurrent.players[i];
      if (player.getNumber() === params.number && player.hp > 0) {
        console.log("Change weapon " + params.direction);
        for (let wI = 0; wI < player.weapons.length; wI++) {
          if (player.currentWeapon === player.weapons[wI]) {
            if (wI === 0 && params.direction === "up") {
              player.currentWeapon = player.weapons[player.weapons.length - 1];
            }
            else if (wI === player.weapons.length - 1
              && params.direction === "down") {
              player.currentWeapon = player.weapons[0];
            }
            else if (params.direction === "up") {
              player.currentWeapon = player.weapons[wI - 1];
            }
            else if (params.direction === "down") {
              player.currentWeapon = player.weapons[wI + 1];
            }
            console.log("Current weapon: " + player.currentWeapon.name);
            wI = player.weapons.length;
          }
        }
      }
    }
  }

};


function gameLoop(roomName) {
  if (!state[roomName]) {
    return;
  }

  for (h = 0; h < state[roomName].players.length; h++) {
    let player = state[roomName].players[h];

    if (player.moving) {
      player.animation.update();
    }
    else {
      player.animation.reset();
    }
    player.moving = false;

    // Update weapons cooldowns
    let weapon;
    for (let weaponI = 0; weaponI < player.weapons.length; weaponI++) {
      weapon = player.weapons[weaponI];
      if (weapon.cooldownTimer !== weapon.cooldown) {
        weapon.cooldownTimer += 1 / config.system.framerate;
        if (weapon.cooldownTimer >= weapon.cooldown) {
          weapon.cooldownTimer = weapon.cooldown;
        }
      }
      if (weapon.type === "Firearm") {
        if (weapon.reloadCoolDownTimer !== weapon.reloadCoolDown) {
          weapon.cooldownTimer = 0;
          weapon.reloadCoolDownTimer += 1 / config.system.framerate;
          if (weapon.reloadCoolDownTimer >= weapon.reloadCoolDown) {
            weapon.cooldownTimer = weapon.cooldown;
            weapon.reloadCoolDownTimer = weapon.reloadCoolDown;
          }
        }
      }
    }

    // Update bullets
    let bullet;
    let hitPlayer = false;
    let hitWall = false;
    for (let bulletI = 0; bulletI < player.bullets.length; bulletI++) {
      bullet = player.bullets[bulletI];
      let oldX = bullet.x;
      let oldY = bullet.y;
      let xDiff = Math.cos(bullet.direction) * bullet.speed;
      let yDiff = Math.sin(bullet.direction) * bullet.speed;
      bullet.x += xDiff;
      bullet.y += yDiff;

      hitPlayer = helpers.checkIfBulletHitPlayer(oldX, oldY, bullet, player, state[roomName].players);
      hitWall = helpers.checkIfBulletHitWall(bullet, state[roomName].level.walls, state[roomName].level.dimensions);
      if (hitPlayer) {
        player.bullets.splice(bulletI, 1);
        bulletI--;
        hitPlayer.hp -= bullet.damage;
        if (hitPlayer.hp < 0) {
          hitPlayer.hp = 0;
        }
        console.log("OUCHIE! Hit player: " + hitPlayer.name);
      }
      else if (hitWall) {
        player.bullets.splice(bulletI, 1);
        bulletI--;
        console.log("Hit wall: " + hitWall);
      }
    }

    // Update enemies
    let enemies = state[roomName].enemies;
    let enemy;
    for (let enemyI = 0; enemyI < enemies.length; enemyI++) {
      enemy = enemies[enemyI];
      enemy.update(player, state[roomName].level);
    }
  }
}

function startGameInterval(roomName) {
  const intervalId = setInterval(() => {
    gameLoop(roomName);
    emitGameState(roomName, state[roomName]);
  }, 1000 / config.system.framerate);
}

function emitGameState(room, gameState) {
  io.sockets.in(room).emit("gameState", JSON.stringify(gameState));
}

function emitLobbyState(room, gameState) {
  for (let i = 0; i < gameState.players.length; i++) {
    let player = gameState.players[i];
    io.to(player.client).emit("lobby", player.number, room, gameState);
  }
}

function emitGameLaunch(room, gameState) {
  for (let i = 0; i < gameState.players.length; i++) {
    let player = gameState.players[i];
    io.to(player.client).emit("init", gameState);
  }
}

