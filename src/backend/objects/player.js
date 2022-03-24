
const Character = require("./character"); 

class Player extends Character {
    constructor (client, name, number, maxHP, hp, walkSpd, turnSpd, position, height, width) {
        super(name, maxHP, hp, walkSpd, position, height, width);
        this.client = client;
        this.number = number;
        this.turnSpd = turnSpd;
        this.weaponImg = "knife_hand.png";
    }

    /** Getters */
    getClient () { return this.client; }
    getNumber () { return this.number; }
    getTurnSpd () { return this.turnSpd; }

    /** Setters */
    setClient (newClientID) {
        if (newClientID && newClientID.length > 0) { this.client = newClientID; }
    }
    setNumber (newNumber) {
        if (newNumber > 0) { this.number = newNumber; }
    }
    setTurnSpd (newTurnSpd) {
        if (newTurnSpd > 0) { this.turnSpd = newTurnSpd; }
    }
}

module.exports = Player;
