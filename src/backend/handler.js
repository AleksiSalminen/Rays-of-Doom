
const { io } = require("../app");
module.exports = { io };

const { 
  createNewGame,
  joinGame,
  launchGame,
  removeClient,
  movePlayer,
  attack,
  reload,
  changeWeapon
} = require("./game");


/* When connection is established */
io.on("connection", (client) => {

  client.on("newGame", handleNewGame);
  function handleNewGame(params) { createNewGame(client, params); }

  client.on("joinGame", handleJoinGame);
  function handleJoinGame(params) { joinGame(client, params); }

  client.on("launchGame", handleLaunchGame);
  function handleLaunchGame(params) { launchGame(client, params); }

  client.on("move", handleMovePlayer);
  function handleMovePlayer(params) { movePlayer(client, params); }

  client.on("attack", handleAttacking);
  function handleAttacking(params) { attack(client, params); }

  client.on("reload", handleReload);
  function handleReload(params) { reload(client, params); }

  client.on("changeWeapon", handleChangeWeapon);
  function handleChangeWeapon(params) { changeWeapon(client, params); }

  client.on("disconnect", handleDisconnect);
  function handleDisconnect(params) { removeClient(client, params); }
  
});

