LIGHT_TIME = ['G', 'G', 'G', 'G', 'G', 'Y', 'R', 'R', 'R', 'R', 'R', 'Y'];
LIGHT_MAP = {'G':'R', 'R':'G', 'Y':'Y'};

var VERTICAL_PADDING = 0.03;
var HORIZONTAL_PADDING = 0.02;
var LIGHT_RADIUS = 0.25;
var HEIGHT = 3;

function Light(dim_color, light_color, position, tag){
    this.tag = tag;
    this.dim_color = dim_color;
    this.light_color = light_color;
    this.mesh = new THREE.Mesh(
                        new THREE.SphereGeometry(LIGHT_RADIUS, 15, 15),
                        new THREE.MeshBasicMaterial({color: this.dim_color}));
    this.mesh.position.x = position.x;
    this.mesh.position.y = position.y;
    this.mesh.position.z = position.z;
}
Light.prototype.dim = function() {
    this.mesh.material.color.setHex(this.dim_color);
};
Light.prototype.light = function() {
    this.mesh.material.color.setHex(this.light_color);
};
Light.prototype.draw = function(scene) {
    scene.add(this.mesh);
};
Light.r = function(position) {
    return new Light(0x802626, 0xFF0000, position, 'R');
};
Light.g = function(position) {
    return new Light(0x268026, 0x00FF00, position, 'G');
};
Light.y = function(position) {
    return new Light(0x808026, 0xFFFF00, position, 'Y');
};

function TrafficLight(position, width, depth) {
    this.time_offset = randomInt(Cantor_pairing(Math.floor(position.x), Math.floor(position.z)), 0, LIGHT_TIME.length);
    this.road = new Road(position, width, depth);
    var z11 = position.z+(LIGHT_RADIUS+HORIZONTAL_PADDING);
    var z12 = position.z-(LIGHT_RADIUS+HORIZONTAL_PADDING);
    var x21 = position.x+(LIGHT_RADIUS+HORIZONTAL_PADDING);
    var x22 = position.x-(LIGHT_RADIUS+HORIZONTAL_PADDING);
    var h1 = HEIGHT+(2*LIGHT_RADIUS+VERTICAL_PADDING);
    var h2 = HEIGHT;
    var h3 = HEIGHT-(2*LIGHT_RADIUS+VERTICAL_PADDING);
    this.light1 = [Light.r({x:position.x, z:z11, y:h1}),
                   Light.r({x:position.x, z:z12, y:h1}),
                   Light.y({x:position.x, z:z11, y:h2}),
                   Light.y({x:position.x, z:z12, y:h2}),
                   Light.g({x:position.x, z:z11, y:h3}),
                   Light.g({x:position.x, z:z12, y:h3})];
    this.light2 = [Light.r({x:x21, z:position.z, y:h1}),
                   Light.r({x:x22, z:position.z, y:h1}),
                   Light.y({x:x21, z:position.z, y:h2}),
                   Light.y({x:x22, z:position.z, y:h2}),
                   Light.g({x:x21, z:position.z, y:h3}),
                   Light.g({x:x22, z:position.z, y:h3})];
    this.box = new THREE.Mesh(
                new THREE.BoxGeometry( (LIGHT_RADIUS+HORIZONTAL_PADDING)*2,
                                        VERTICAL_PADDING*4 + LIGHT_RADIUS*6,
                                       (LIGHT_RADIUS+HORIZONTAL_PADDING)*2),
                new THREE.MeshBasicMaterial( {color: 0xBFBFBF} ));
    this.box.position.x = position.x;
    this.box.position.z = position.z;
    this.box.position.y = HEIGHT;
}

TrafficLight.prototype.draw = function(scene) {
    this.road.draw(scene);
    this.light1.forEach(function(x) {x.draw(scene);});
    this.light2.forEach(function(x) {x.draw(scene);});
    scene.add(this.box);
};

TrafficLight.prototype.update = function() {
    var status = this.getLightStatus();
    var tag1 = status.status1;
    var tag2 = status.status2;
    this.light1.forEach(function(light) {
        if (light.tag == tag1) light.light();
        else light.dim();
    });
    this.light2.forEach(function(light) {
        if (light.tag == tag2) light.light();
        else light.dim();
    });
};

TrafficLight.prototype.getLightStatus = function() {
    var status = LIGHT_TIME[(Time.t() + this.time_offset) % LIGHT_TIME.length];
    return {status1: status, status2: LIGHT_MAP[status]};
};

function  Cantor_pairing(k1, k2) {
    return 0.5 * (k1+k2) * (k1+k2+1) + k2;
}
