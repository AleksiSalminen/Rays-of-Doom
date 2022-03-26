
class Minimap {

    constructor(settings) {
        this.show = settings.initialValues.show;

        this.widthPercent = settings.initialValues.widthPercent;
        this.heightPercent = settings.initialValues.heightPercent;
        
        this.updateSize();

        this.TOP_LEFT = settings.valueRanges.position[0];
        this.TOP = settings.valueRanges.position[1];
        this.TOP_RIGHT = settings.valueRanges.position[2];
        this.BOTTOM_LEFT = settings.valueRanges.position[3];
        this.BOTTOM = settings.valueRanges.position[4];
        this.BOTTOM_RIGHT = settings.valueRanges.position[5];
        this.position = settings.initialValues.position;

        this.backgroundColor = settings.initialValues.backgroundColor;
        this.wallColor = settings.initialValues.wallColor;
        this.otherPlayerColor = settings.initialValues.otherPlayerColor;
        this.playerColor = settings.initialValues.playerColor;
    }

    updateSize() {
        if (window.innerWidth > window.innerHeight) {
            this.height = window.innerHeight * this.heightPercent;
            this.width = this.height;
        }
        else {
            this.width = window.innerWidth * this.widthPercent;
            this.height = this.width;
        }
    }

    getCoordinates(width, height) {
        let startX, startY;

        if (this.position === this.TOP_LEFT) {
            startX = 0;
            startY = 0;
        }
        else if (this.position === this.TOP) {
            startX = width / 2 - this.width / 2;
            startY = 0;
        }
        else if (this.position === this.TOP_RIGHT) {
            startX = width - this.width;
            startY = 0;
        }
        else if (this.position === this.BOTTOM_LEFT) {
            startX = 0;
            startY = height - this.height;
        }
        else if (this.position === this.BOTTOM) {
            startX = width / 2 - this.width / 2;
            startY = height - this.height;
        }
        else if (this.position === this.BOTTOM_RIGHT) {
            startX = width - this.width;
            startY = height - this.height;
        }
        else {
            startX = 0; startY = 0;
        }

        return { x: startX, y: startY };
    }

}


const MAPS = {
    Minimap
}

export {
    MAPS
};
