
const { io } = require("../app");
module.exports = { io };

const { 
  createNewGame,
  joinGame,
  launchGame,
  removeClient,
  movePlayer,
  shoot,
  reload
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

  client.on("shoot", handleShooting);
  function handleShooting(params) { shoot(client, params); }

  client.on("reload", handleReload);
  function handleReload(params) { reload(client, params); }

  client.on("disconnect", handleDisconnect);
  function handleDisconnect(params) { removeClient(client, params); }
  
});

