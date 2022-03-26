
import { GRAPHICS } from '../view/graphics.js'
import { KEYBOARD } from '../io/keyboard.js';

const serverAddress = "http://localhost:3000";

let gameCode;
let playerNumber;
let player;

let moveForwardKey  = 87; // W key
let moveBackwardKey = 83; // S key
let moveLeftKey     = 65; // A key
let moveRightKey    = 68; // D key
let rotateLeftKey   = 37; // Left arrow key
let rotateRightKey  = 39; // Right arrow key
let shootKey        = 38; // Up arrow key
let reloadKey       = 82; // R key
let weaponUpKey     = 81; // Q key
let weaponDownKey   = 69; // E key
let fullscreenKey   = 80; // P key

let weaponChangeDelay = 5;
let weaponChangeTimer = weaponChangeDelay;

/* Establish socket connection with the server backend */
const socket = io(serverAddress);

/* Set the socket message listeners */
socket.on("lobby", handleLobby);
socket.on("init", handleInit);
socket.on("gameState", handleGameState);
socket.on('unknownCode', handleUnknownCode);
socket.on('tooManyPlayers', handleTooManyPlayers);
socket.on('gameHasStarted', handleGameHasStarted);


function updateGame(playerNumber, gameState) {
  console.log(gameCode);
  console.log(gameState);

  if (weaponChangeTimer < weaponChangeDelay) {
    weaponChangeTimer++;
  }
  player = findPlayer(playerNumber, gameState.players);
  GRAPHICS.updateGraphics(player, gameState.players, gameState.enemies, gameState.level);
}

function initGame(gameState) {
  GRAPHICS.initGraphics(gameState.ui);
}

function initLobby(gameState) {
  player = findPlayer(playerNumber, gameState.players);
  GRAPHICS.initLobby(player, gameState.players, gameCode);
}


/**
 * Game event handlers
 */

/**
 * Emit a message to the server to create a new game
 */
function newGame() {
  const name = document.getElementById("name").value;

  socket.emit('newGame', {
    name: name
  });
}
document.getElementById('newGameButton').addEventListener('click', newGame);

/**
 * Emit a message to the server to join to a game
 */
function joinGame() {
  const code = document.getElementById('gameCodeInput').value;
  const name = document.getElementById("name").value;
  socket.emit('joinGame', { code: code, name: name });
}
document.getElementById('joinGameButton').addEventListener('click', joinGame);

/**
 * Emit a message to the server to launch the game
 */
function launchGame() {
  socket.emit('launchGame', {});
}
document.getElementById('launchGameButton').addEventListener('click', launchGame);

/**
 * Emits the corresponding messages to the server according to the 
 * keys pressed
 */
function sendKeysPressed() {
  const keysPressed = KEYBOARD.getKeysPressed();
  for (let i = 0; i < keysPressed.length; i++) {
    let key = keysPressed[i];

    if (key === moveForwardKey) {
      socket.emit('move', { dir: "Forward", number: playerNumber });
    }
    else if (key === moveBackwardKey) {
      socket.emit('move', { dir: "Back", number: playerNumber });
    }
    else if (key === moveLeftKey) {
      socket.emit('move', { dir: "Left", number: playerNumber });
    }
    else if (key === moveRightKey) {
      socket.emit('move', { dir: "Right", number: playerNumber });
    }
    else if (key === rotateLeftKey) {
      socket.emit('move', { dir: "RotLeft", number: playerNumber });
    }
    else if (key === rotateRightKey) {
      socket.emit('move', { dir: "RotRight", number: playerNumber });
    }
    else if (key === shootKey) {
      socket.emit('attack', { number: playerNumber });
    }
    else if (key === reloadKey) {
      socket.emit('reload', { number: playerNumber });
    }
    else if (key === weaponUpKey) {
      if (weaponChangeTimer === weaponChangeDelay) {
        socket.emit('changeWeapon', { number: playerNumber, direction: "up" });
        weaponChangeTimer = 0;
      }
    }
    else if (key === weaponDownKey) {
      if (weaponChangeTimer === weaponChangeDelay) {
        socket.emit('changeWeapon', { number: playerNumber, direction: "down" });
        weaponChangeTimer = 0;
      }
    }
    else if (key === fullscreenKey) {
      GRAPHICS.setFullScreen();
    }
  }
}

function handleMouseMove(e) {
  let movementX = e.movementX ||
    e.mozMovementX ||
    e.webkitMovementX ||
    0;

  if (movementX < 0) {
    socket.emit('move', { dir: "RotLeft", number: playerNumber, movementX: movementX });
  }
  else if (movementX > 0) {
    socket.emit('move', { dir: "RotRight", number: playerNumber, movementX: movementX });
  }
}

function handleMouseDown(e) {
  socket.emit('attack', { number: playerNumber });
}

function handleMouseWheel(e) {
  let delta = null
  let direction = false;

  if (!e) { // if the event not provided, get it from the window object
    e = window.event;
  }
  if (e.wheelDelta) { // will work in most cases
    delta = e.wheelDelta / 60;
  } else if (e.detail) { // fallback for Firefox
    delta = -e.detail / 2;
  }
  if (delta !== null) {
    direction = delta > 0 ? 'up' : 'down';
  }

  socket.emit('changeWeapon', { number: playerNumber, direction: direction });
}
document.addEventListener("wheel", handleMouseWheel, false);


/**
 * Socket message receiver handlers
 */

/**
 * Update the game according to the game state
 * @param {*} gameState the current game state
 */
function handleGameState(gameState) {
  gameState = JSON.parse(gameState);
  // Send the corresponding messages according to keys pressed
  sendKeysPressed();
  // Update the game according to the game state
  updateGame(playerNumber, gameState);
}

function handleLobby(plNumber, code, gameState) {
  playerNumber = plNumber;
  gameCode = code;
  initLobby(gameState);
}

/**
 * 
 * @param {*} plNumber 
 */
function handleInit(gameState) {
  initGame(gameState);
}

/**
 * If the player gave an unknown game code
 */
function handleUnknownCode() {
  playerNumber = null;
  alert('Unknown game code')
}

/**
 * If the requested game room is full
 */
function handleTooManyPlayers() {
  playerNumber = null;
  alert('Game lobby is full');
}

/**
 * If the game has already started
 */
function handleGameHasStarted() {
  playerNumber = null;
  alert('The game has already started');
}


/**
 * Other functions
 */

/**
 * Finds a certain player from a list of players
 * @param {*} plNumber 
 * @param {*} players 
 */
function findPlayer(plNumber, players) {
  for (let i = 0; i < players.length; i++) {
    let pl = players[i];
    if (pl.number === plNumber) {
      return pl;
    }
  }
}


let gameDisplay = document.getElementById('gameDisplay');
gameDisplay.onclick = function () {
  gameDisplay.requestPointerLock();
};
document.addEventListener('pointerlockchange', handlePointerLockChange, false);

function handlePointerLockChange() {
  if (document.pointerLockElement === gameDisplay) {
    document.addEventListener("mousemove", handleMouseMove, false);
    document.addEventListener("mousedown", handleMouseDown, false);
  } else {
    document.removeEventListener("mousemove", handleMouseMove, false);
  }
}

