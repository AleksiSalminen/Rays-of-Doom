
import { GAMECAMERA } from './camera.js';
import { UI } from './ui.js';

let titleScreen = document.getElementById("titleScreen");
let lobbyScreen = document.getElementById("gameLobby");
let gameView = document.getElementById("gameView");
let gameDisplay = document.getElementById('gameDisplay');

let initialized = false;
let gameCamera;
let ui;

let fullScreen = false;
let fullScreenDelay = 30;
let fullScreenTimer = 30;


function initGraphics(settings) {
  /** Hide the main menu and game lobby, show the game canvas */
  titleScreen.style.display = "none";
  lobbyScreen.style.display = "none";
  gameView.style.display = "block";

  /** Create a new UI instance */
  ui = new UI(gameDisplay, settings.images.paths.uiImagePath, settings);

  /** Create a new Camera instance */
  const rays = settings.raycaster.initialValues;
  gameCamera = new GAMECAMERA.Camera(
    gameDisplay,
    rays.resolution,
    rays.focalLength,
    rays.range,
    rays.lightRange,
    rays.scaleFactor,
    settings.images.paths,
    settings.images.animation
  );

  initialized = true;
}

function updateGraphics(player, players, enemies, level) {
  if (initialized && gameCamera && ui) {
    if (fullScreenTimer < fullScreenDelay) {
      fullScreenTimer++;
    }

    // Empty the canvas
    gameDisplay.getContext('2d').clearRect(0, 0, gameDisplay.width, gameDisplay.height);
    // Use the camera to render game view
    gameCamera.render(player, players, enemies, level);
    // Render the UI
    ui.render(player, players, enemies, level);
  }
}

function initLobby(player, players, gameCode) {
  /** Hide main menu and game view, show game lobby */
  titleScreen.style.display = "none";
  gameView.style.display = "none";
  lobbyScreen.style.display = "block";

  document.getElementById("gameCodeText").innerHTML = "Gamecode: " + gameCode;

  let playersList = document.getElementById("playersList");
  let playersListString = "<ul id='playersList' style='list-style: none; padding-left: 0;'>";
  for (let i = 0;i < players.length;i++) {
    if (players[i].number !== player.number) {
      playersListString += "<li>" + players[i].name + "</li>";
    }
    else {
      playersListString += "<li><b>" + players[i].name + "</b></li>";
    }
  }
  playersListString += "</ul>"
  playersList.innerHTML = playersListString;
}

function setFullScreen() {
  if (fullScreenTimer === fullScreenDelay) {
    if (!fullScreen) {
      gameView.webkitRequestFullscreen(Element.ALLOW_KEYBOARD_INPUT);
      gameView.mozRequestFullScreen();
      gameView.msRequestFullscreen();
      gameView.requestFullscreen(); // standard
    }
    else {
      document.webkitExitFullscreen();
      document.mozCancelFullScreen();
      document.msExitFullscreen();
      document.exitFullscreen();
    }
    fullScreen = !fullScreen;
    fullScreenTimer = 0;
  }
}

window.addEventListener('resize', resizeCanvas, false);
function resizeCanvas() {
  if (gameDisplay && ui && gameCamera) {
    gameCamera.updateSize();
    ui.updateSize();
  }
}


const GRAPHICS = {
  initGraphics,
  updateGraphics,
  initLobby,
  setFullScreen
};

export {
  GRAPHICS
};
