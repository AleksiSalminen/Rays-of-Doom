const Weapon = require("./weapon.js");


class Firearm extends Weapon {
    constructor(name, fpsImg, damage, cooldown, cooldownTimer, clipSize, ammo, clipAmmo, bulletSpeed) {
        super(name, fpsImg, damage, cooldown, cooldownTimer);
        this.clipSize = clipSize;
        this.ammo = ammo;
        this.clipAmmo = clipAmmo;
        this.bulletSpeed = bulletSpeed;
    }

}


module.exports = Firearm;
