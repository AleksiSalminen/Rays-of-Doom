
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
    for (let i = 0;i < config.levels.length;i++) {
      name = config.levels[i];
      level = new Level(
        name + ".json", 
        {}, 
        {}
      );
      levels.push(level);
    }

    return levels;
  }

};
