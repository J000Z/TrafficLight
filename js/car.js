function Car(scene) {
    // Car
    this.block = false;
    this.scene = scene;
    this.car_material = Physijs.createMaterial(
        new THREE.MeshLambertMaterial({ color: 0xff6666 }),
        0.8, // high friction
        0.2 // low restitution
    );
    this.wheel_material = Physijs.createMaterial(
        new THREE.MeshLambertMaterial({ color: 0x444444 }),
        0.8, // high friction
        0.5 // medium restitution
    );

    this.scale = 0.18;
    this.bodyWidth  = 8 * this.scale;
    this.bodyHeight = 5 * this.scale;
    this.bodyDepth  = 6 * this.scale;
    this.wheelRadius = 2 * this.scale;
    this.wheelThickness = 1 * this.scale;
    this.wheelDistance = 1.2 * this.scale;
    this.wheelDistance_FD = 3.5 * this.scale;

    this.initialElevation = 2 * this.scale;
    this.wheel_geometry = new THREE.CylinderGeometry( this.wheelRadius, this.wheelRadius, this.wheelThickness, 8 );

    this.body = this.buildBody();
    scene.add(this.body);

    this.chromeMaterial = new THREE.MeshBasicMaterial( {envMap: Game.cubeCamera().renderTarget } );
    this.ball = new THREE.Mesh(
                        new THREE.SphereGeometry(this.bodyDepth*0.5, 32, 32),
                        this.chromeMaterial);
    this.ball.position.y = this.bodyDepth*0.4-0.15;
    //scene.add(this.ball);
    this.body.add(this.ball);

    this.wheel_fl = this.buildWheel(-this.wheelDistance_FD, this.wheelRadius, this.bodyDepth/2+this.wheelDistance, true);
    this.wheel_fr = this.buildWheel(-this.wheelDistance_FD, this.wheelRadius, -(this.bodyDepth/2+this.wheelDistance), true);
    this.wheel_bl = this.buildWheel(this.wheelDistance_FD,  this.wheelRadius, this.bodyDepth/2+this.wheelDistance, false);
    this.wheel_br = this.buildWheel(this.wheelDistance_FD,  this.wheelRadius, -(this.bodyDepth/2+this.wheelDistance), false);
    this.addControls();
}
Car.prototype.setVisible = function(x) {
    this.body.visible = x;
    this.ball.visible = x;
};
Car.prototype.position = function() {
    return this.body.position;
};
Car.prototype.cell = function(map) {
    var cell_index = map.whichCell(this.position().x, this.position().z);
    var cell = map.getCell(cell_index.i, cell_index.j);
    return cell;
};
Car.prototype.rotation = function() {
    return this.body.rotation;
};
Car.prototype.direction = function() {
    var pLocal = new THREE.Vector3( -2, 0, 0 );
    var pWorld = pLocal.applyMatrix4( this.body.matrixWorld );
    var dir = pWorld.sub( this.body.position ).normalize();
    return dir;
};
Car.prototype.buildBody = function() {
    var body = new Physijs.BoxMesh(
        new THREE.BoxGeometry( this.bodyWidth, this.bodyHeight, this.bodyDepth ),
        this.car_material,
        1000
    );
    body.position.y = this.bodyHeight/2 + this.wheelRadius;
    //body.receiveShadow = body.castShadow = true;
    body.up = new THREE.Vector3( -1, 0, 0 );
    return body;
};
Car.prototype.buildWheel = function(x, y, z, rotatable) {
    var wheel = new Physijs.CylinderMesh(
        this.wheel_geometry,
        this.wheel_material,
        500
    );
    wheel.rotation.x = Math.PI / 2;
    wheel.position.set(x, y, z);
    wheel.receiveShadow = wheel.castShadow = true;
    this.scene.add(wheel);
    var wheel_constraint = new Physijs.DOFConstraint(
        wheel, this.body, new THREE.Vector3(x,y,z)
    );
    this.scene.addConstraint(wheel_constraint);
    if (rotatable) {
        wheel_constraint.setAngularLowerLimit({ x: 0, y: -Math.PI / 8, z: 1 });
        wheel_constraint.setAngularUpperLimit({ x: 0, y: Math.PI / 8, z: 0 });
    } else {
        wheel_constraint.setAngularLowerLimit({ x: 0, y: 0, z: 0 });
        wheel_constraint.setAngularUpperLimit({ x: 0, y: 0, z: 0 });
    }
    return {mesh: wheel, constraint: wheel_constraint};
};
Car.prototype.addControls = function() {
    var car = this;
    document.addEventListener(
        'keydown',
        function( ev ) {
            if (car.block) return;
            switch( ev.keyCode ) {
                case 37:
                    // Left
                    car.wheel_fl.constraint.configureAngularMotor( 1, -Math.PI / 2, Math.PI / 2, 1, 200 );
                    car.wheel_fr.constraint.configureAngularMotor( 1, -Math.PI / 2, Math.PI / 2, 1, 200 );
                    car.wheel_fl.constraint.enableAngularMotor( 1 );
                    car.wheel_fr.constraint.enableAngularMotor( 1 );
                    break;

                case 39:
                    // Right
                    car.wheel_fl.constraint.configureAngularMotor( 1, -Math.PI / 2, Math.PI / 2, -1, 200 );
                    car.wheel_fr.constraint.configureAngularMotor( 1, -Math.PI / 2, Math.PI / 2, -1, 200 );
                    car.wheel_fl.constraint.enableAngularMotor( 1 );
                    car.wheel_fr.constraint.enableAngularMotor( 1 );
                    break;

                case 38:
                    // Up
                    car.wheel_bl.constraint.configureAngularMotor( 2, 1, 0, 5, 2000 );
                    car.wheel_br.constraint.configureAngularMotor( 2, 1, 0, 5, 2000 );
                    car.wheel_bl.constraint.enableAngularMotor( 2 );
                    car.wheel_br.constraint.enableAngularMotor( 2 );
                    break;

                case 40:
                    // Down
                    car.wheel_bl.constraint.configureAngularMotor( 2, 1, 0, -5, 2000 );
                    car.wheel_br.constraint.configureAngularMotor( 2, 1, 0, -5, 2000 );
                    car.wheel_bl.constraint.enableAngularMotor( 2 );
                    //car.wheel_br_constraint.enableAngularMotor( 2 );
                    break;
            }
        }
    );

    document.addEventListener(
        'keyup',
        function( ev ) {
            if (car.block) return;
            switch( ev.keyCode ) {
                case 37:
                    // Left
                    car.wheel_fl.constraint.disableAngularMotor( 1 );
                    car.wheel_fr.constraint.disableAngularMotor( 1 );
                    break;

                case 39:
                    // Right
                    car.wheel_fl.constraint.disableAngularMotor( 1 );
                    car.wheel_fr.constraint.disableAngularMotor( 1 );
                    break;

                case 38:
                    // Up
                    car.wheel_bl.constraint.disableAngularMotor( 2 );
                    car.wheel_br.constraint.disableAngularMotor( 2 );
                    break;

                case 40:
                    // Down
                    car.wheel_bl.constraint.disableAngularMotor( 2 );
                    car.wheel_br.constraint.disableAngularMotor( 2 );
                    break;
            }
        }
    );
};
