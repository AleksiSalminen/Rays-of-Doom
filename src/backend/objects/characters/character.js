
const Animation = require("./animation");

class CharacterAnimation extends Animation {
    constructor (delay) {
        super(delay);
    }

    update() {
        this.count++;
        if (this.count === this.delay) {
            this.step++;
            if (this.step > 6) {
                this.step = 1;
            }

            if (this.step === 1 || this.step === 3) {
                this.frameIndex = 2;
            }
            else if (this.step === 2) {
                this.frameIndex = 1;
            }
            else if (this.step === 4 || this.step === 6) {
                this.frameIndex = 4;
            }
            else if (this.step === 5) {
                this.frameIndex = 3;
            }
            this.count = 0;
        }
    }

    reset() {
        this.count = 0;
        this.frameIndex = 0;
        this.step = 1;
    }
}


class Character {
    constructor (name, maxHP, hp, walkSpd, position, height, width) {
        this.name = name;
        this.maxHP = maxHP;
        this.hp = hp;
        this.walkSpd = walkSpd;
        this.pos = position;
        this.height = height;
        this.width = width;
        const animationDelay = 5;
        this.animation = new CharacterAnimation(animationDelay);
    }

    /** Getters */
    getName () { return this.name; }
    getMaxHP () { return this.maxHP; }
    getHP () { return this.hp; }
    getWalkSpd () { return this.walkSpd; }
    getPosition () { return this.pos; }

    /** Setters */
    setName (newName) {
        if (newName && newName.length > 0) { this.name = newName; }
    }
    setMaxHP (newMaxHP) {
        if (newMaxHP > 0) { this.maxHP = newMaxHP; }
    }
    setHP (newHP) {
        if (newHP >= 0) { this.hp = newHP; }
        else { this.hp = 0; }
    }
    setWalkSpd (newWalkSpd) {
        if (newWalkSpd > 0) { this.walkSpd = newWalkSpd; }
    }
    setPosition (newPos) {
        if (newPos) { this.pos = newPos; }
    }
}


module.exports = Character;
