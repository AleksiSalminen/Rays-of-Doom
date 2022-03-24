const express = require("express");
const app = express();
const server = require("http").Server(app);
const io = require("socket.io")(server);
/* Export the IO-object (for the socket handler) */
module.exports = { io };
/* Require the socket handler, so that it is loaded on start-up */
require("./backend/handler");

/* Require the config file */
const config = require("../def/config/config.json");

let path = require("path");
let favicon = require("serve-favicon");


/* Express-paths */

app.use(favicon(path.join(__dirname, "../" + config.system.favicon)));
app.use("/", express.static(path.join(__dirname, "frontend")));

app.get("/", (req, res) => {
  res.sendFile(__dirname + "/frontend/index.html");
});


/* Start the application */

const ip = config.system.ip;
const port = config.system.port;

server.listen(port, ip, () => {
  console.log("Rays of Purity listening on " + ip + ":" + port);
});

