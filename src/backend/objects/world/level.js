
const fs = require("fs");

const LEVEL_FILES_LOC = "../def/levels/"


class Level {
    constructor(fileName, objects, enemies) {
        const data = fs.readFileSync(LEVEL_FILES_LOC + fileName, "utf8");
        const levelInfo = JSON.parse(data);

        this.fileName = fileName;
        this.name = levelInfo.name;
        this.light = levelInfo.light;
        this.skybox = levelInfo.skybox;
        this.playerSpawn = levelInfo.playerSpawn;
        this.wallTextures = levelInfo.wallTextures;
        this.walls = levelInfo.walls;
        this.dimensions = levelInfo.dimensions;
    }


    /** Getters */
    getFileName() { return this.fileName; }
    getName() { return this.name; }
    getLight() { return this.light; }
    getSkyBox() { return this.skybox; }
    getWallTextures() { return this.wallTextures; }
    getWalls() { return this.walls; }

    /** Setters */
    setFileName(newFileName) {
        if (newFileName && newFileName.length > 0) { this.fileName = newFileName; }
    }
    setName(newName) {
        if (newName && newName.length > 0) { this.name = newName; }
    }
    setLight(newLight) {
        if (newLight >= 0) { this.light = newLight; }
    }
    setSkyBox(newSkyBox) {
        if (newSkyBox && newSkyBox.length > 0) { this.skybox = newSkyBox; }
    }
    setWallTextures(newWallTextures) {
        if (newWallTextures && newWallTextures.length > 0) { this.wallTextures = newWallTextures; }
    }
    setWalls(newWalls) {
        if (newWalls && newWalls.length > 0) { this.walls = newWalls; }
    }

}

module.exports = Level;
