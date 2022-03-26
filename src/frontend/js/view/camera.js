
import { RAYCASTING } from './raycasting.js';
import { IMG_PROC } from '../io/img_process.js';
import { ANIMATION } from './animation.js';


class Camera {

  /**
   * 
   * Constructors
   * 
   */

  constructor(canvas, resolution, focalLength, range, lightRange, scaleFactor, imagePaths, animImgs) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d');

    if (window.innerHeight < window.innerWidth) {
      this.width = canvas.width = window.innerHeight;
      this.height = canvas.height = window.innerHeight - window.innerHeight / 20;
    }
    else {
      this.width = canvas.width = window.innerWidth;
      this.height = canvas.height = window.innerWidth - window.innerWidth / 20;
    }

    this.resolution = resolution;
    this.spacing = this.width / resolution;
    this.focalLength = focalLength || 0.8;
    this.range = range;
    this.lightRange = lightRange;
    this.scale = (this.width + this.height) / scaleFactor;

    this.skyboxImagePath = imagePaths.skyboxImagePath;
    this.wallImagePath = imagePaths.wallImagePath;
    this.otherPlayerImagePath = imagePaths.otherPlayerImagePath;
    this.fpsImagePath = imagePaths.fpsImagePath;

    this.weaponImg;
    this.skyImg;
    this.wallImages = [];
    let opPath = this.otherPlayerImagePath;
    let opWidth = animImgs.width;
    let opHeight = animImgs.height;
    this.otherPlayerImageSet = [
      /** Front facing images */
      new IMG_PROC.Bitmap(opPath + animImgs.opf1, opWidth, opHeight),
      new IMG_PROC.Bitmap(opPath + animImgs.opf2, opWidth, opHeight),
      new IMG_PROC.Bitmap(opPath + animImgs.opf3, opWidth, opHeight),
      new IMG_PROC.Bitmap(opPath + animImgs.opf4, opWidth, opHeight),
      new IMG_PROC.Bitmap(opPath + animImgs.opf5, opWidth, opHeight),
      /** Back facing images */
      new IMG_PROC.Bitmap(opPath + animImgs.opb1, opWidth, opHeight),
      new IMG_PROC.Bitmap(opPath + animImgs.opb2, opWidth, opHeight),
      new IMG_PROC.Bitmap(opPath + animImgs.opb3, opWidth, opHeight),
      new IMG_PROC.Bitmap(opPath + animImgs.opb4, opWidth, opHeight),
      new IMG_PROC.Bitmap(opPath + animImgs.opb5, opWidth, opHeight),
      /** Left facing images */
      new IMG_PROC.Bitmap(opPath + animImgs.opl1, opWidth, opHeight),
      new IMG_PROC.Bitmap(opPath + animImgs.opl2, opWidth, opHeight),
      new IMG_PROC.Bitmap(opPath + animImgs.opl3, opWidth, opHeight),
      new IMG_PROC.Bitmap(opPath + animImgs.opl4, opWidth, opHeight),
      new IMG_PROC.Bitmap(opPath + animImgs.opl5, opWidth, opHeight),
      /** Right facing images */
      new IMG_PROC.Bitmap(opPath + animImgs.opr1, opWidth, opHeight),
      new IMG_PROC.Bitmap(opPath + animImgs.opr2, opWidth, opHeight),
      new IMG_PROC.Bitmap(opPath + animImgs.opr3, opWidth, opHeight),
      new IMG_PROC.Bitmap(opPath + animImgs.opr4, opWidth, opHeight),
      new IMG_PROC.Bitmap(opPath + animImgs.opr5, opWidth, opHeight),
      /** Front-left facing images */
      new IMG_PROC.Bitmap(opPath + animImgs.opfl1, opWidth, opHeight),
      new IMG_PROC.Bitmap(opPath + animImgs.opfl2, opWidth, opHeight),
      new IMG_PROC.Bitmap(opPath + animImgs.opfl3, opWidth, opHeight),
      new IMG_PROC.Bitmap(opPath + animImgs.opfl4, opWidth, opHeight),
      new IMG_PROC.Bitmap(opPath + animImgs.opfl5, opWidth, opHeight),
      /** Front-right facing images */
      new IMG_PROC.Bitmap(opPath + animImgs.opfr1, opWidth, opHeight),
      new IMG_PROC.Bitmap(opPath + animImgs.opfr2, opWidth, opHeight),
      new IMG_PROC.Bitmap(opPath + animImgs.opfr3, opWidth, opHeight),
      new IMG_PROC.Bitmap(opPath + animImgs.opfr4, opWidth, opHeight),
      new IMG_PROC.Bitmap(opPath + animImgs.opfr5, opWidth, opHeight),
      /** Back-left facing images */
      new IMG_PROC.Bitmap(opPath + animImgs.opbl1, opWidth, opHeight),
      new IMG_PROC.Bitmap(opPath + animImgs.opbl2, opWidth, opHeight),
      new IMG_PROC.Bitmap(opPath + animImgs.opbl3, opWidth, opHeight),
      new IMG_PROC.Bitmap(opPath + animImgs.opbl4, opWidth, opHeight),
      new IMG_PROC.Bitmap(opPath + animImgs.opbl5, opWidth, opHeight),
      /** Back-right facing images */
      new IMG_PROC.Bitmap(opPath + animImgs.opbr1, opWidth, opHeight),
      new IMG_PROC.Bitmap(opPath + animImgs.opbr2, opWidth, opHeight),
      new IMG_PROC.Bitmap(opPath + animImgs.opbr3, opWidth, opHeight),
      new IMG_PROC.Bitmap(opPath + animImgs.opbr4, opWidth, opHeight),
      new IMG_PROC.Bitmap(opPath + animImgs.opbr5, opWidth, opHeight)
    ];
  }


  /**
   * 
   * Methods
   * 
   */


  /** The main rendering method */

  render(player, players, enemies, level) {
    this.drawSky(player.pos.rotation, level);
    this.drawColumns(player, players, enemies, level);
    this.drawWeapon(player.weaponImg);
    if (player.hp === 0) {
      this.drawDeathMessage();
    }
  };

  drawSky(direction, level) {
    let ctx = this.ctx;

    if (this.skyImg === undefined) {
      this.skyImg = new IMG_PROC.Bitmap(this.skyboxImagePath + level.skybox.fileName, level.skybox.width, level.skybox.height);
    }

    let width = this.skyImg.width * (this.height / this.skyImg.height) * 2;
    let left = (direction / (Math.PI * 2)) * -width;

    ctx.save();
    ctx.drawImage(this.skyImg.image, left, 0, width, this.height);
    if (left < (width - this.width)) {
      ctx.drawImage(this.skyImg.image, left + width, 0, width, this.height);
    }
    if (level.light > 0) {
      ctx.fillStyle = '#ffffff';
      ctx.globalAlpha = level.light * 0.1;
      ctx.fillRect(0, this.height * 0.5, this.width, this.height * 0.5);
    }
    ctx.restore();
  };

  drawDeathMessage() {
    let ctx = this.ctx;
    ctx.fillStyle = "rgba(255, 0, 0, 0.5)";
    ctx.fillRect(0, 0, this.width, this.height);
    ctx.font = "28px Arial";
    ctx.fillStyle = "#FFFFFF";
    ctx.fillText("YOU ARE DEAD", this.width / 2 - 100, this.height / 2);
  }

  drawWeapon(imgName) {
    let ctx = this.ctx;
    let weaponImg = this.weaponImg;
    let fpsImagePath = this.fpsImagePath;

    if (weaponImg === undefined) {
      weaponImg = new IMG_PROC.Bitmap(fpsImagePath + imgName, 319, 320);
    }

    let left = this.width * 0.66;
    let top = this.height * 0.6;
    ctx.drawImage(weaponImg.image, left, top, weaponImg.width * this.scale, weaponImg.height * this.scale);
  };

  drawColumns(player, players, enemies, level) {
    let ctx = this.ctx;
    let wallImages = this.wallImages;
    let wallImagePath = this.wallImagePath;

    ctx.save();

    if (wallImages.length === 0) {
      let imgID;
      let imgName;
      let texture;
      let width;
      let height;
      for (let imgI = 0; imgI < level.wallTextures.length; imgI++) {
        imgID = level.wallTextures[imgI].id;
        imgName = level.wallTextures[imgI].fileName;
        width = level.wallTextures[imgI].width;
        height = level.wallTextures[imgI].height;
        texture = new IMG_PROC.Bitmap(wallImagePath + imgName, width, height);
        wallImages.push({
          id: imgID,
          texture: texture
        });
      }
    }

    let zBuffer = [];
    for (let column = 0; column < this.resolution; column++) {
      let x = column / this.resolution - 0.5;
      let angle = Math.atan2(x, this.focalLength);
      let ray = RAYCASTING.castRay(level, player.pos, player.pos.rotation + angle, this.range);
      this.drawColumn(column, ray, angle, level, zBuffer);
    }
    this.drawObjects(player, players, enemies, player.pos.rotation, zBuffer);
    ctx.restore();
  };

  drawColumn(column, ray, angle, level, zBuffer) {
    let ctx = this.ctx;
    let left = Math.floor(column * this.spacing);
    let width = Math.ceil(this.spacing);
    let hit = -1;

    while (++hit < ray.length && ray[hit].height <= 0);

    for (let s = ray.length - 1; s >= 0; s--) {
      let step = ray[s];

      if (s === hit) {
        let wallImg = this.getWallImg(step.wall).texture;

        let textureX = Math.floor(wallImg.width * step.offset);
        let wallProj = this.wallProject(step.height, angle, step.distance);

        ctx.globalAlpha = 1;
        ctx.drawImage(wallImg.image, textureX, 0, 1, wallImg.height, left, wallProj.top, width, wallProj.height);

        ctx.fillStyle = '#000000';
        ctx.globalAlpha = Math.max((step.distance + step.shading) / this.lightRange - level.light, 0);
        ctx.fillRect(left, wallProj.top, width, wallProj.height);

        zBuffer.push(step.distance);
        s = -1;
      }
    }
  };

  getWallImg(wallID) {
    let wallImg;

    if (wallID === 0) {
      return this.wallImages[0];
    }

    let texture;
    let txID;
    for (let imgI = 0; imgI < this.wallImages.length; imgI++) {
      texture = this.wallImages[imgI];
      txID = texture.id;

      if (txID === wallID) {
        wallImg = texture;
        imgI = this.wallImages.length;
      }
    }

    return wallImg;
  }

  wallProject(height, angle, distance) {
    let z = distance * Math.cos(angle);
    let wallHeight = this.height * height / z;
    let bottom = this.height / 2 * (1 + 1 / z);
    return {
      top: bottom - wallHeight,
      height: wallHeight
    };
  };

  drawObjects(player, players, enemies, angle, zBuffer) {
    let otherPlayer;
    let enemy;

    // Calculate other players' distances from the player
    for (let plI = 0; plI < players.length; plI++) {
      otherPlayer = players[plI];
      players[plI].dist = Math.sqrt(Math.pow((player.pos.x - otherPlayer.pos.x), 2) + Math.pow((player.pos.y - otherPlayer.pos.y), 2));
    }
    // Sort the other players to descending order 
    // according to distance from the player
    players.sort(function (a, b) {
      return b.dist - a.dist
    });

    // Calculate enemies' distances from the player
    for (let eI = 0; eI < enemies.length; eI++) {
      enemy = enemies[eI];
      enemies[eI].dist = Math.sqrt(Math.pow((player.pos.x - enemy.pos.x), 2) + Math.pow((player.pos.y - enemy.pos.y), 2));
    }
    // Sort the enemies to descending order 
    // according to distance from the player
    enemies.sort(function (a, b) {
      return b.dist - a.dist
    });


    let rowIndex;
    let enemyIndex = 0;
    let otherPlayerImg;
    for (let plI = 0; plI < players.length; plI++) {
      otherPlayer = players[plI];

      for (let eI = enemyIndex; eI < enemies.length; eI++) {
        enemy = enemies[eI];
        if (enemy.dist > otherPlayer.dist) {
          rowIndex = ANIMATION.getSpriteRowIndex(player.pos, enemy.pos);
          otherPlayerImg = this.otherPlayerImageSet[rowIndex * 5 + enemy.animation.frameIndex];
          this.drawSprite(player, enemy, angle, otherPlayerImg, zBuffer);
          enemyIndex = eI;
        }
        else {
          eI = enemies.length;
        }
      }

      if (otherPlayer.number !== player.number) {
        rowIndex = ANIMATION.getSpriteRowIndex(player.pos, otherPlayer.pos);
        otherPlayerImg = this.otherPlayerImageSet[rowIndex * 5 + otherPlayer.animation.frameIndex];
        this.drawSprite(player, otherPlayer, angle, otherPlayerImg, zBuffer);
      }
    }

    if (enemyIndex <= enemies.length - 1) {
      for (let eI = enemyIndex; eI < enemies.length; eI++) {
        enemy = enemies[eI];
        rowIndex = ANIMATION.getSpriteRowIndex(player.pos, enemy.pos);
        otherPlayerImg = this.otherPlayerImageSet[rowIndex * 5 + enemy.animation.frameIndex];
        this.drawSprite(player, enemy, angle, otherPlayerImg, zBuffer);
      }
    }
  }

  drawSprite(player, sprite, angle, texture, zBuffer) {
    let ctx = this.ctx;
    // Player rotation to degrees
    angle = angle * (180 / Math.PI);

    // Find the distances between sprite and player
    let xDist = sprite.pos.x - player.pos.x;
    let yDist = sprite.pos.y - player.pos.y;
    let dist = Math.sqrt(Math.pow((player.pos.x - sprite.pos.x), 2) + Math.pow((player.pos.y - sprite.pos.y), 2));

    // Angle between sprite and player
    let spritePlayerAngle = Math.atan2(yDist, xDist);
    spritePlayerAngle *= (180 / Math.PI);
    if (spritePlayerAngle < 0) spritePlayerAngle += 360;

    // Get the angle difference
    let angleDiff = spritePlayerAngle - angle;
    if (spritePlayerAngle > 270 && angle < 90) angleDiff -= 360;
    if (angle > 270 && spritePlayerAngle < 90) angleDiff += 360;

    // Get the drawn sprite measures
    let height = this.height * sprite.height / dist;
    let bottom = this.height / 2 * (1 + 1 / dist);
    let width = height / sprite.height * sprite.width;

    // Some magic
    let magicNumber = 1.5;

    // Base X- and Y-coordinates of the sprite
    let yTmp = bottom - height;
    let xTmp = angleDiff * this.width / (this.focalLength * (180 / Math.PI) * magicNumber) + this.width / 2 - width / 2;

    // Starting and ending ray positions for drawing the sprite
    let startX = Math.floor(xTmp / this.spacing);
    let endX = Math.floor((xTmp + width) / this.spacing);

    // Z-Buffer comparisons
    let zBufferedLocs = this.compareZBuffer(startX, endX, dist, zBuffer);

    // Update the starting and ending
    startX = zBufferedLocs.startX * this.spacing;
    endX = zBufferedLocs.endX * this.spacing;

    // Get the texture clipping information
    let clipStart = 0;
    let clipEnd = 0;
    if (zBufferedLocs.wallAtBeginning) {
      clipStart = texture.width - ((endX - startX) / width * texture.width);
      clipEnd = texture.width - clipStart;
    }
    else {
      clipStart = 0;
      clipEnd = (endX - startX) / width * texture.width;
    }

    // Set the brightness according to distance
    let distShading = 100 / dist * this.lightRange / 4;
    distShading = distShading > 100 ? 100 : distShading;
    ctx.filter = "brightness(" + distShading + "%)";

    // Draw the sprite
    ctx.globalAlpha = 1;
    ctx.drawImage(
      texture.image,
      clipStart, 0, clipEnd, texture.height,
      startX, yTmp, endX - startX, height
    );

    // Set brightness back to normal
    ctx.filter = "brightness(100%)";
  }

  compareZBuffer(startX, endX, dist, zBuffer) {
    // Value gap for the Z-Buffer comparison
    let depthCheckStart = startX;
    let depthCheckEnd = endX;

    // Z-Buffer comparisons
    let wallAtBeginning = false;
    for (let col = depthCheckStart; col <= depthCheckEnd; col++) {
      // Check if compared value is outside draw distance
      if (!zBuffer[col]) {

      }
      // See if there are walls in front of the sprite
      else if (zBuffer[col] < dist) {
        if (col === depthCheckStart) {
          wallAtBeginning = true;
        }

        if (wallAtBeginning) {
          startX = col;
        }
        else {
          endX = col - 1;
          col = depthCheckEnd;
        }
      }
    }

    return { startX: startX, endX: endX, wallAtBeginning: wallAtBeginning };
  }

}



/** Exports */

const GAMECAMERA = {
  Camera
};

export {
  GAMECAMERA
};