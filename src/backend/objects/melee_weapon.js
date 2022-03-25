const Weapon = require("./weapon");


class MeleeWeapon extends Weapon {
    constructor(type, name, fpsImg, damage, cooldown, cooldownTimer, reach) {
        super(type, name, fpsImg, damage, cooldown, cooldownTimer);
        this.reach = reach;
    }

}


module.exports = MeleeWeapon;

