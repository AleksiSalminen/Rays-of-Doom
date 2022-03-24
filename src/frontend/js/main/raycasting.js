
function castRay(level, point, angle, range) {
    let sin = Math.sin(angle);
    let cos = Math.cos(angle);
    let noWall = { length2: Infinity };

    return ray({ x: point.x, y: point.y, height: 0, distance: 0 });

    function ray(origin) {
        let stepX = step(sin, cos, origin.x, origin.y);
        let stepY = step(cos, sin, origin.y, origin.x, true);
        let nextStep = stepX.length2 < stepY.length2
            ? inspect(stepX, 1, 0, origin.distance, stepX.y)
            : inspect(stepY, 0, 1, origin.distance, stepY.x);

        if (nextStep.distance > range) return [origin];
        return [origin].concat(ray(nextStep));
    }

    function step(rise, run, x, y, inverted) {
        if (run === 0) return noWall;
        let dx = run > 0 ? Math.floor(x + 1) - x : Math.ceil(x - 1) - x;
        let dy = dx * (rise / run);
        return {
            x: inverted ? y + dy : x + dx,
            y: inverted ? x + dx : y + dy,
            length2: dx * dx + dy * dy
        };
    }

    function inspect(step, shiftX, shiftY, distance, offset) {
        let dx = cos < 0 ? shiftX : 0;
        let dy = sin < 0 ? shiftY : 0;
        step.wall = getLevelTile(step.x - dx, step.y - dy);
        if (step.wall === 0) {
            step.height = 0;
        }
        else {
            step.height = 1;
        }
        step.distance = distance + Math.sqrt(step.length2);
        if (shiftX) step.shading = cos < 0 ? 2 : 0;
        else step.shading = sin < 0 ? 2 : 1;
        step.offset = offset - Math.floor(offset);
        return step;
    }

    function getLevelTile(x, y) {
        x = Math.floor(x);
        y = Math.floor(y);
        if (x < 0 || x > level.dimensions.width - 1 || y < 0 || y > level.dimensions.height - 1) return -1;
        return level.walls[y * level.dimensions.width + x];
    }
};


const RAYCASTING = {
    castRay
};

export {
    RAYCASTING
};

