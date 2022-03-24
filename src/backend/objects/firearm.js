const Weapon = require("./weapon.js");


class Firearm extends Weapon {
    constructor(name, fpsImg, damage, cooldown, clipSize, ammo) {
        super(name, fpsImg, damage, cooldown);
        this.clipSize = clipSize;
        this.ammo = ammo;
    }

}


module.exports = Firearm;
