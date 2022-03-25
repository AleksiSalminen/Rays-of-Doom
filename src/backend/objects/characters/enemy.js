const Character = require("./character");


class Enemy extends Character {
    constructor(name, maxHP, hp, walkSpd, position, height, width) {
        super(name, maxHP, hp, walkSpd, position, height, width);
    }
    
}


module.exports = Enemy;
