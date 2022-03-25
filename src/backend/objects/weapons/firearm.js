const Weapon = require("./weapon.js");


class Firearm extends Weapon {
    constructor(type, name, fpsImg, damage, cooldown, cooldownTimer, clipSize, ammo, clipAmmo, bulletSpeed, reloadCoolDown, reloadCoolDownTimer) {
        super(type, name, fpsImg, damage, cooldown, cooldownTimer);
        this.clipSize = clipSize;
        this.ammo = ammo;
        this.clipAmmo = clipAmmo;
        this.bulletSpeed = bulletSpeed;
        this.reloadCoolDown = reloadCoolDown;
        this.reloadCoolDownTimer = reloadCoolDownTimer;
    }

}


module.exports = Firearm;
