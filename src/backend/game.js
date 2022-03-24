const { io } = require('./handler');
const config = require("../../def/config/config.json");
const helpers = require("./helpers");
const Player = require("./objects/player");

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
      stateCurrent.players[i] = new Player(
        stateCurrent.players[i].client,
        stateCurrent.players[i].name,
        stateCurrent.players[i].number,
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
        config.players.width
      );
    }

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
      if (character.getNumber() === params.number) {
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
  for (let i = 0;i < gameState.players.length;i++) {
    let player = gameState.players[i];
    io.to(player.client).emit("lobby", player.number, room, gameState);
  }
}

function emitGameLaunch(room, gameState) {
  for (let i = 0;i < gameState.players.length;i++) {
    let player = gameState.players[i];
    io.to(player.client).emit("init", gameState);
  }
}

