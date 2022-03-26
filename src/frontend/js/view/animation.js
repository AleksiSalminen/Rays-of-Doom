
const FRAME_SETS = {
    "DIR_TOWARDS":    [ 0, 1, 2, 3, 4],
    "DIR_AWAY":       [ 5, 6, 7, 8, 9],
    "DIR_LEFT":       [10,11,12,13,14],
    "DIR_RIGHT":      [15,16,17,18,19],
    "DIR_TOW_LEFT":   [20,21,22,23,24],
    "DIR_TOW_RIGHT":  [25,26,27,28,29],
    "DIR_AWAY_LEFT":  [30,31,32,33,34],
    "DIR_AWAY_RIGHT": [35,36,37,38,39]
};


function getSpriteRowIndex(playerPos, otherPlayerPos) {
    let rowIndex = 0;

    const segmentAngle = 2 * Math.PI / 8;
    const p1Rot = playerPos.rotation;
    const p2Rot = otherPlayerPos.rotation;

    let rotDiff;
    if (p2Rot >= p1Rot) {
        rotDiff = p2Rot - p1Rot + segmentAngle/2;
    }
    else {
        rotDiff = p2Rot + (2*Math.PI-p1Rot) + segmentAngle/2;
    }
    if (rotDiff > 2*Math.PI) {
        rotDiff -= 2*Math.PI;
    }

    if (rotDiff < segmentAngle || rotDiff >= segmentAngle*8) {
        /** Back */
        rowIndex = 1;
    }
    else if (rotDiff >= segmentAngle && rotDiff < segmentAngle*2) {
        /** Back-right */
        rowIndex = 7;
    }
    else if (rotDiff >= segmentAngle*2 && rotDiff < segmentAngle*3) {
        /** Right */
        rowIndex = 3;
    }
    else if (rotDiff >= segmentAngle*3 && rotDiff < segmentAngle*4) {
        /** Front-right */
        rowIndex = 5;
    }
    else if (rotDiff >= segmentAngle*4 && rotDiff < segmentAngle*5) {
        /** Front */
        rowIndex = 0;
    }
    else if (rotDiff >= segmentAngle*5 && rotDiff < segmentAngle*6) {
        /** Front-left */
        rowIndex = 4;
    }
    else if (rotDiff >= segmentAngle*6 && rotDiff < segmentAngle*7) {
        /** Left */
        rowIndex = 2;
    }
    else if (rotDiff >= segmentAngle*7 && rotDiff < segmentAngle*8) {
        /** Back-left */
        rowIndex = 6;
    }

    return rowIndex;
}


const ANIMATION = {
    getSpriteRowIndex
};

export {
    ANIMATION
};

