function City(scene) {
    this.scene = scene;
    this.map = new Map();
    this.cells = {};
    this.update({x:0, z:0});
    this.seed = Math.random();
}

City.prototype.trace = function(target) {
    this.target = target;
};

City.prototype.update = function(position) {
    position = position || this.target.position();
    var index = this.map.whichCell(position.x, position.z);
    var distance = 5;
    for (var i=index.i-distance; i<=index.i+distance; i++) {
        for (var j=index.j-distance; j<=index.j+distance; j++) {
            var key  = JSON.stringify([i, j]);
            var cell = this.map.getCell(i, j);
            var obj = this.cells[key];
            if(obj === undefined) {
                obj = City.contructCell(cell);
                if (obj !== null) obj.draw(this.scene);
                this.cells[key] = obj;
            }
            if (cell.type == Cell.ROAD_INTERSECTION) {
                obj.update();
            }
        }
    }
};

City.prototype.getCellObject = function(i, j) {
    var key  = JSON.stringify([i, j]);
    return this.cells[key];
};

City.contructCell = function(cell) {
    if (cell.type == Cell.ROAD_INTERSECTION)
        return new TrafficLight(cell.position, cell.width, cell.depth);
    if (cell.type == Cell.ROAD_VERTICAL || cell.type == Cell.ROAD_HORIZONTAL)
        return new Road(cell.position, cell.width, cell.depth);
    if (cell.type == Cell.BLOCK)
        return new Block({'x': cell.position.x, 'z':cell.position.z, 'y':Asset.getHeight()/2});
};
