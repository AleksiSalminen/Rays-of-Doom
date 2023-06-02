# Rays-of-Doom

Doom and Wolfenstein inspired multiplayer online PvE FPS.
Improved version of JS-RayCaster (https://github.com/AleksiSalminen/JS-Raycaster)

## Project Structure

(root)
  |
  |--- def
  |     |--- config
  |     |     |--- config.json
  |     |
  |     |--- images
  |     |     |--- ...
  |     |
  |     |--- levels
  |     |     |--- ...
  |
  |--- src
  |     |--- backend
  |     |     |--- objects
  |     |     |     |--- characters
  |     |     |     |     |--- ai.js
  |     |     |     |     |--- animation.js
  |     |     |     |     |--- character.js
  |     |     |     |     |--- enemy.js
  |     |     |     |     |--- player.jss
  |     |     |     |
  |     |     |     |--- weapons
  |     |     |     |     |--- bullet.js
  |     |     |     |     |--- firearm.js
  |     |     |     |     |--- melee_weapon.js
  |     |     |     |     |--- weapon.js
  |     |     |     |
  |     |     |     |--- world
  |     |     |     |     |--- level.js
  |     |     |
  |     |     |--- game.js
  |     |     |--- handler.js
  |     |     |--- helpers.js
  |     |
  |     |--- frontend
  |     |     |--- images
  |     |     |     |--- ...
  |     |     |
  |     |     |--- js
  |     |     |     |--- audio
  |     |     |     |     |--- audio.js
  |     |     |     |
  |     |     |     |--- data
  |     |     |     |     |--- metrics.js
  |     |     |     |
  |     |     |     |--- helpers
  |     |     |     |     |--- jquery.min.js
  |     |     |     |     |--- socket.io.js
  |     |     |     |
  |     |     |     |--- io
  |     |     |     |     |--- img_process.js
  |     |     |     |     |--- keyboard.js
  |     |     |     |
  |     |     |     |--- main
  |     |     |     |     |--- handler.js
  |     |     |     |
  |     |     |     |--- view
  |     |     |     |     |--- animation.js
  |     |     |     |     |--- camera.js
  |     |     |     |     |--- graphics.js
  |     |     |     |     |--- maps.js
  |     |     |     |     |--- raycasting.js
  |     |     |     |     |--- ui.js
  |     |     |
  |     |     |--- index.html
  |     |
  |     |--- app.js
  |     |--- package.json
  |
  |--- .gitignore
  |--- README.md

