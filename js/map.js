function Map() {
    this.ROAD_WIDTH = 3;
    this.BLOCK_WIDTH = Block.getWidth();
    this.BLOCK_DEPTH = Block.getDepth();
}

Map.prototype.getCell = function(i, j) {
    var position_x = (0.5*this.ROAD_WIDTH + 0.5*this.BLOCK_WIDTH)*i;
    var position_z = (0.5*this.ROAD_WIDTH + 0.5*this.BLOCK_DEPTH)*j;
    var position = {x:position_x, z:position_z};
    if (i%2 === 0 && j%2 === 0)
        return new Cell(Cell.ROAD_INTERSECTION, position, this.ROAD_WIDTH, this.ROAD_WIDTH, i, j);
    else if (i%2 === 0)
        return new Cell(Cell.ROAD_HORIZONTAL, position, this.ROAD_WIDTH, this.BLOCK_DEPTH, i, j);
    else if (j%2 === 0)
        return new Cell(Cell.ROAD_VERTICAL, position, this.BLOCK_WIDTH, this.ROAD_WIDTH, i, j);
    else
        return new Cell(Cell.BLOCK, position, this.BLOCK_DEPTH, this.BLOCK_DEPTH, i, j);
};

Map.prototype.whichCell = function(x, z) {
    return {i:Math.round(x/(0.5*this.ROAD_WIDTH + 0.5*this.BLOCK_WIDTH)),
            j:Math.round(z/(0.5*this.ROAD_WIDTH + 0.5*this.BLOCK_DEPTH))};
};

function Cell(type, position, width, depth, i, j) {
    this.type = type;
    this.position = position;
    this.width = width;
    this.depth = depth;
    this.i = i;
    this.j = j;
}

Cell.ROAD_VERTICAL   = 'ROAD_VERTICAL';
Cell.ROAD_HORIZONTAL = 'ROAD_HORIZONTAL';
Cell.ROAD_INTERSECTION = 'ROAD_INTERSECTION';
Cell.BLOCK = 'BLOCK';
