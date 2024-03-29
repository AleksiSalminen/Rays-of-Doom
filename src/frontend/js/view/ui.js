import { MAPS } from './maps.js';


class UI {

    /**
     * 
     * Constructors
     * 
     */

    constructor(canvas, uiImagePath, settings) {
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');

        this.updateSize();

        this.minimap = new MAPS.Minimap(settings.minimap);
        this.uiImagePath = uiImagePath;
        this.settings = settings;
    }


    /**
     * 
     * Methods
     * 
     */

    updateSize() {
        if (window.innerHeight < window.innerWidth) {
            this.width = this.canvas.width = window.innerHeight;
            this.height = this.canvas.height = window.innerHeight - window.innerHeight / 20;
        }
        else {
            this.width = this.canvas.width = window.innerWidth;
            this.height = this.canvas.height = window.innerWidth - window.innerWidth / 20;
        }
        if (this.minimap) {
            this.minimap.updateSize();
        }
    }

    render(player, players, enemies, level) {
        if (this.settings.metrics.show) {
            this.drawMetrics(level.name, player);
        }
        if (this.minimap.show) {
            this.drawMiniMap(player, players, enemies, level);
        }
        this.drawItemBelt(player.currentWeapon, player.weapons);
        this.drawCrossHair();
    }

    drawMetrics(levelName, player) {
        let ctx = this.ctx;
        let settings = this.settings.metrics;

        ctx.fillStyle = settings.backgroundColor;
        ctx.fillRect(0, 0, this.width, this.height*settings.heightPercent);

        let fontHeightPercent = 1.5;
        let fontY = (this.height * settings.heightPercent) / fontHeightPercent;
        let fontSize;
        if (window.innerWidth > window.innerHeight) {
            fontSize = window.innerHeight * settings.fontSize;
        }
        else {
            fontSize = window.innerWidth * settings.fontSize;
        }
        ctx.textAlign = "start";
        ctx.font = fontSize + "px " + settings.font;
        ctx.fillStyle = settings.fontColor;
        let fontX;
        if (settings.showFPS) {
            fontX = this.width * 0.04;
            ctx.fillText("FPS: " + fps + " / 60", fontX, fontY);
        }
        if (settings.showLevel) {
            fontX = this.width * 0.22;
            ctx.fillText("Level: " + levelName, fontX, fontY);
        }
        if (settings.showHP) {
            fontX = this.width/2 + this.width * 0.1;
            ctx.fillText("HP: " + player.hp, fontX, fontY);
        }
        if (settings.showWeapon) {
            fontX = this.width/2 + this.width * 0.2;
            ctx.fillText(player.currentWeapon.name, fontX, fontY);
            if (player.currentWeapon.type === "Firearm") {
                let ammoText = "Ammo: " + player.currentWeapon.clipAmmo + " / " + player.currentWeapon.ammo;
                fontX = this.width/2 + this.width * 0.33;
                ctx.fillText(ammoText, fontX, fontY);
            }
        }
    }

    drawItemBelt(currentWeapon, weapons) {
        let ctx = this.ctx;
        let settings = this.settings.itemBelt;

        let items = weapons.length;
        let beltHeight = this.height * settings.beltHeightPercent;
        let itemMargin = beltHeight * settings.itemMargin;

        // Draw background
        ctx.fillStyle = settings.backgroundColor;
        ctx.fillRect(
            this.width / 2 - (items * beltHeight) / 2 - itemMargin / 2,
            this.height - beltHeight,
            items * (beltHeight) + itemMargin,
            beltHeight
        );

        // Draw reload message
        if (currentWeapon.reloadCoolDownTimer !== currentWeapon.reloadCoolDown) {
            let fontSize;
            if (window.innerWidth > window.innerHeight) {
                fontSize = window.innerHeight * settings.reloadMsgFontSize;
            }
            else {
                fontSize = window.innerWidth * settings.reloadMsgFontSize;
            }
            ctx.font = fontSize + "px " + settings.reloadMsgFont;
            ctx.fillStyle = settings.reloadMsgColor;
            ctx.textAlign = "center";
            ctx.fillText(settings.reloadMsgText, this.width / 2, this.height - beltHeight - window.innerWidth/100);
        }

        // Draw items
        for (let i = 0; i < items; i++) {
            let weapon = weapons[i];

            if (weapon) {
                // Draw item frames
                let startX = this.width / 2 - items / 2 * (beltHeight) + itemMargin / 2 + i * (beltHeight);
                let startY = this.height - beltHeight + itemMargin;
                if (weapon.name === currentWeapon.name) {
                    ctx.fillStyle = settings.currentWeaponColor;
                }
                else {
                    ctx.fillStyle = settings.otherWeaponsColor;
                }
                ctx.fillRect(
                    startX,
                    startY,
                    beltHeight - itemMargin,
                    beltHeight - 2 * itemMargin
                );

                // Draw cycles
                ctx.fillStyle = settings.cycleColor;
                ctx.beginPath();
                // Go to frame's center
                ctx.moveTo(
                    startX + beltHeight / 2 - itemMargin / 2,
                    startY + beltHeight / 2 - itemMargin
                );

                let percent = 0;
                if (weapon.reloadCoolDownTimer && weapon.reloadCoolDownTimer !== weapon.reloadCoolDown) {
                    percent = weapon.reloadCoolDownTimer / weapon.reloadCoolDown;
                }
                else {
                    percent = weapon.cooldownTimer / weapon.cooldown;
                }
                if (percent === 1) {
                    percent = 0;
                }
                let radius = beltHeight / 2 - itemMargin;
                let angleStart = Math.PI * 3 / 2;
                let angleEnd = Math.PI * 2 * percent;

                // Draw an arc
                // (centerX, centerY, radius, angleStart, angleEnd)
                ctx.arc(
                    startX + beltHeight / 2 - itemMargin / 2,
                    startY + beltHeight / 2 - itemMargin,
                    radius, angleStart, angleStart + angleEnd
                );

                // Draw a line to close the shape
                ctx.lineTo(
                    startX + beltHeight / 2 - itemMargin / 2,
                    startY + beltHeight / 2 - itemMargin
                );

                // Fill the shape
                ctx.fill();
            }
        }
    }

    drawCrossHair() {
        let length = 5;
        let distance = 2;
        let ctx = this.ctx;
        ctx.strokeStyle = "#FFFFFF";
        ctx.lineWidth = 1;

        ctx.beginPath();
        ctx.moveTo(this.width / 2 - distance, this.height / 2 - distance);
        ctx.lineTo(this.width / 2 - distance - length, this.height / 2 - distance - length);
        ctx.stroke();

        ctx.beginPath();
        ctx.moveTo(this.width / 2 + distance, this.height / 2 - distance);
        ctx.lineTo(this.width / 2 + distance + length, this.height / 2 - distance - length);
        ctx.stroke();

        ctx.beginPath();
        ctx.moveTo(this.width / 2 - distance, this.height / 2 + distance);
        ctx.lineTo(this.width / 2 - distance - length, this.height / 2 + distance + length);
        ctx.stroke();

        ctx.beginPath();
        ctx.moveTo(this.width / 2 + distance, this.height / 2 + distance);
        ctx.lineTo(this.width / 2 + distance + length, this.height / 2 + distance + length);
        ctx.stroke();
    }

    drawMiniMap(player, players, enemies, level) {
        let ctx = this.ctx;
        let minimap = this.minimap;

        let width = minimap.width;
        let height = minimap.height;
        let stepX = width / level.dimensions.width;
        let stepY = height / level.dimensions.height;

        let coordinates = minimap.getCoordinates(this.width, this.height);
        let startX = coordinates.x;
        let startY = coordinates.y;

        /** Draw background */
        ctx.globalAlpha = 1;
        ctx.fillStyle = minimap.backgroundColor;
        ctx.fillRect(startX, startY, width, height);

        /** Draw walls */
        ctx.fillStyle = minimap.wallColor;
        for (let i = 0; i < level.dimensions.width; i++) {
            for (let j = 0; j < level.dimensions.height; j++) {
                let wall = level.walls[j * level.dimensions.width + i];
                if (wall !== 0) {
                    ctx.fillRect(startX + i * stepX, startY + j * stepY, stepX + 1, stepY + 1);
                }
            }
        }

        let enemy;
        let eX;
        let eY;

        /** Draw enemy path */
        /*ctx.fillStyle = "#990000";
        enemy = enemies[0];
        let route;
        for (let g = 0;g < enemy.route.length;g++) {
          route = enemy.route[g];
          ctx.fillRect(startX + route.x * stepX, startY + route.y * stepY, stepX, stepY);
        }*/

        /** Draw enemies */
        ctx.fillStyle = "#FF0000";
        for (let eI = 0; eI < enemies.length; eI++) {
            enemy = enemies[eI];
            eX = enemy.pos.x;
            eY = enemy.pos.y;
            ctx.beginPath();
            ctx.arc(startX + eX * stepX, startY + eY * stepY, stepX / 3, 0, Math.PI * 2);
            ctx.fill();
        }

        let plX;
        let plY;

        /** Draw other players */
        ctx.fillStyle = minimap.otherPlayerColor;
        for (let k = 0; k < players.length; k++) {
            const pl = players[k];
            if (pl.number !== player.number) {
                plX = pl.pos.x;
                plY = pl.pos.y;
                ctx.beginPath();
                ctx.arc(startX + plX * stepX, startY + plY * stepY, stepX / 2, 0, Math.PI * 2);
                ctx.fill();
            }
        }

        /** Draw player */
        plX = player.pos.x;
        plY = player.pos.y;
        ctx.fillStyle = minimap.playerColor;
        ctx.beginPath();
        ctx.arc(startX + plX * stepX, startY + plY * stepY, stepX / 2, 0, Math.PI * 2);
        ctx.fill();
    }

}


export {
    UI
};
