

function Bitmap(src, width, height) {
    this.image = new Image();
    this.image.src = src;
    this.width = width;
    this.height = height;
}


const IMG_PROC = {
    Bitmap
};

export {
    IMG_PROC
};

