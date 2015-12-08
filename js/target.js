function Target(position) {
    this.position = position;
    this.radius = 1;
    this.color = 0xE600FF;
    this.line_width = 0.01;
    this.height = this.radius + 0.5;
    this.mesh = new THREE.Mesh(
                        new THREE.OctahedronGeometry(this.radius),
                        new THREE.MeshBasicMaterial({color: this.color,
                                                     wireframe: true,
                                                     wireframeLinewidth: this.line_width}));
    this.mesh.position.x = position.x;
    this.mesh.position.y = this.height;
    this.mesh.position.z = position.z;
}

Target.prototype.draw = function(scene) {
    scene.add(this.mesh);
    var mesh = this.mesh;
    function update() {mesh.rotation.y += 0.1;}
    window.setInterval(update, 100);
};
