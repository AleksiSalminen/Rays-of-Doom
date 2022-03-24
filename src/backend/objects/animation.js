
class Animation {
    constructor (delay) {
        this.count = 0; // Number of game cycles since last frame change
        this.delay = delay; // Number of game cycles to wait until next frame change
        this.frameIndex = 0; // The frame's index in the current animation frame set
        this.step = 1; // Step number in the animation
    }
}


module.exports = Animation;
