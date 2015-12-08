function Road(position, width, depth) {
    var planeMaterial = Physijs.createMaterial(
        new THREE.MeshBasicMaterial({color: 0xf2f2f2}),
        0.8, // high friction
        0.4 // low restitution
    );
    this.plane = new Physijs.BoxMesh(
        new THREE.BoxGeometry(width, 1, depth),
        planeMaterial,
        0 // mass
    );
    this.plane.position.x = position.x;
    this.plane.position.z = position.z;
    this.plane.position.y = -0.5;
    //this.plane.receiveShadow = true;
}

Road.prototype.draw = function(scene) {
    scene.add(this.plane);
};
