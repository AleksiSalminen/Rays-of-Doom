const Character = require("./character");
const AI = require("./ai");
const Graph = AI.Graph;
const aStar = AI.aStar;


function createGraph(level) {
    let structuredLevel = new Array(level.dimensions.height);
    for (let j = 0;j < level.dimensions.height;j++) {
        structuredLevel[j] = new Array(level.dimensions.width);
    }

    for (let i = 0;i < level.walls.length;i++) {
        if (level.walls[i] === 0) {
            structuredLevel[i % level.dimensions.width][Math.floor(i / level.dimensions.width)] = 1;
        }
        else {
            structuredLevel[i % level.dimensions.width][Math.floor(i / level.dimensions.width)] = 0;
        }
    }

    let graph = new Graph(structuredLevel);
    return graph;
}

function getRoute(player, enemy, level) {
    var graph = createGraph(level);
    var start = graph.grid
        [Math.floor(enemy.pos.x)]
        [Math.floor(enemy.pos.y)]
    ;
    var end = graph.grid
        [Math.floor(player.pos.x)]
        [Math.floor(player.pos.y)]
    ;
    // result is an array containing the shortest path
    var result = aStar.search(graph, start, end);
    return result;
    //console.log(result);
    /*
    var graphDiagonal = new Graph([
        [1, 1, 1, 1],
        [0, 1, 1, 0],
        [0, 0, 1, 1]
    ], { diagonal: true });

    var start = graphDiagonal.grid[0][0];
    var end = graphDiagonal.grid[1][2];
    var resultWithDiagonals = aStar.search(graphDiagonal, start, end, { heuristic: aStar.heuristics.diagonal });
    */
    /*
    // Weight can easily be added by increasing the values within the graph, and where 0 is infinite (a wall)
    var graphWithWeight = new Graph([
        [1, 1, 2, 30],
        [0, 4, 1.3, 0],
        [0, 0, 5, 1]
    ]);
    var startWithWeight = graphWithWeight.grid[0][0];
    var endWithWeight = graphWithWeight.grid[1][2];
    var resultWithWeight = aStar.search(graphWithWeight, startWithWeight, endWithWeight);
    // resultWithWeight is an array containing the shortest path taking into account the weight of a node
    */
}


class Enemy extends Character {
    constructor(name, maxHP, hp, walkSpd, position, height, width, pathUpdateDelay, pathUpdateTimer) {
        super(name, maxHP, hp, walkSpd, position, height, width);
        this.route = [];
        this.pathUpdateDelay = pathUpdateDelay;
        this.pathUpdateTimer = pathUpdateTimer;
    }

    update(player, level) {
        if (this.pathUpdateTimer === this.pathUpdateDelay) {
            this.route = getRoute(player, this, level);
            this.pathUpdateTimer = 0;
        }
        else {
            this.pathUpdateTimer++;
        }
    }

}


module.exports = Enemy;
