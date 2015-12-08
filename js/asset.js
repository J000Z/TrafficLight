var COLORS = [0x1BE7FF, 0x6EEB83, 0xE4FF1A, 0xE8AA14, 0xFF5714];
var ASSET_WIDTH  = 4;
var ASSET_HEIGHT = 3;
var ASSET_DEPTH  = 2;

function getRandomInt(min, max) {
    max--;
    return Math.floor(Math.random() * (max - min + 1) + min);
}
function getRandomColor() {
    return COLORS[getRandomInt(0, COLORS.length)];
}
function Asset(type, geometry) {
    //var material = new THREE.MeshLambertMaterial({color:getRandomColor()});
    var material = new THREE.MeshBasicMaterial({color: getRandomColor(), wireframe: false});
    //var material =  new THREE.MeshPhongMaterial( { color:getRandomColor(), shading: THREE.FlatShading } );
    this.type = type;
    this.geometry = geometry;
    this.mesh = new Physijs.BoxMesh(geometry, material, 2000);
    //this.mesh.castShadow = true;
    //this.mesh.receiveShadow = true;
}
Asset.prototype.position = function(position) {
    this.mesh.position.x = position.x || 0;
    this.mesh.position.y = position.y || 0;
    this.mesh.position.z = position.z || 0;
    return this;
};
Asset.prototype.draw = function(scene) {
    scene.add(this.mesh);
};
Asset.type = function(type) {
    if (type == 'cube') {
        var cubeGeometry = new THREE.BoxGeometry(ASSET_WIDTH, ASSET_HEIGHT, ASSET_DEPTH);//width, height, depth
        return new Asset(type, cubeGeometry);
    }
};
Asset.getWidth  = function() {return ASSET_WIDTH;};
Asset.getDepth  = function() {return ASSET_DEPTH;};
Asset.getHeight = function() {return ASSET_HEIGHT;};
