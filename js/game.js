var Game = (function(document){
    var container, stats, scene, camera, physics_stats, cubeCamera, renderer;
    var MARGIN = 0;
    var SCREEN_HEIGHT = window.innerHeight - MARGIN * 2;
    var SCREEN_WIDTH  = window.innerWidth;
    var clock = new THREE.Clock();
    var controls;
    var city, car;
    var target;
    var carHP;
    var compassContainer;
    var compass;
    var distance;

    function setContainer(c) {
        container = c;
    }

    function setCompassContainer(c) {
        compassContainer = c;
        compass = new Compass(compassContainer);
    }

    function setFlyControl(camera) {
        controls = new THREE.FlyControls( camera );
        // position and point the camera to the center of the scene
        camera.position.x = -30;
        camera.position.y = 40;
        camera.position.z = 30;
        camera.lookAt(scene.position);
        controls.movementSpeed = 1000;
        controls.domElement = container;
        controls.rollSpeed = Math.PI / 24;
        controls.autoForward = false;
        controls.dragToLook = true;
    }

    function getSkybox() {
        var img = (new THREE.TextureLoader()).load('textures/atlantic.jpg');
        img.magFilter = THREE.NearestFilter;
        img.minFilter = THREE.LinearMipMapLinearFilter;
        img.wrapS = img.wrapT = THREE.RepeatWrapping;
        var skyboxMaterial = new THREE.MeshBasicMaterial({map:img, depthWrite: false, side: THREE.BackSide});
    	var skybox = new THREE.Mesh(new THREE.SphereGeometry(700,32,32), skyboxMaterial);
        return skybox;
    }

    function init() {
        container.innerHTML = "";
        carHP = 100;
        // create a scene, that will hold all our elements such as objects, cameras and lights.
        scene = new Physijs.Scene();
        scene.setGravity(new THREE.Vector3( 0, -30, 0 ));
        scene.addEventListener(
            'update',
            function() {
                scene.simulate( undefined, 2 );
                physics_stats.update();
            }
        );

        // create a camera, which defines where we're looking at.
        var radius = 10;
        camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 1000);
        camera.position.set( 0.0, radius, radius * 3.5 );
        setFlyControl(camera);

        cubeCamera = new THREE.CubeCamera( 0.5, 100000, 128 );
        //cubeCamera.renderTarget.texture.minFilter = THREE.LinearMipMapLinearFilter;
    	scene.add( cubeCamera );

        city = new City(scene);
        car = new Car(scene);
        city.trace(car);

        var light = new THREE.AmbientLight( 0x404040 ); // soft white light
        scene.add( light );

        scene.add(getSkybox());

        //var spotLight = new THREE.SpotLight(0xffffff, 1, 1000);
        //spotLight.position.set(-40, 60, -10);
        //spotLight.castShadow = true;
        //scene.add(spotLight);

        var light2 = new THREE.HemisphereLight( 0xffffff, 0x080820, 0.5 );
        scene.add( light2 );

        renderer = new THREE.WebGLRenderer({precision: 'lowp', antialias: true});
        //renderer.setClearColor(new THREE.Color(0xEEEEEE));
        renderer.setPixelRatio( window.devicePixelRatio );
        renderer.setSize( SCREEN_WIDTH, SCREEN_HEIGHT );
        renderer.sortObjects = false;
        //renderer.shadowMap.enabled = true;
        //renderer.shadowMapSoft = true;

        renderer.autoClear = true;

        container.appendChild( renderer.domElement );

        stats = new Stats();
        stats.domElement.style.position = 'absolute';
        stats.domElement.style.top = '0px';
        stats.domElement.style.zIndex = 100;
        container.appendChild( stats.domElement );

        physics_stats = new Stats();
        physics_stats.domElement.style.position = 'absolute';
        physics_stats.domElement.style.top = '50px';
        physics_stats.domElement.style.zIndex = 100;
        container.appendChild( physics_stats.domElement );

        initTarget();
        animate();
    }

    function animate() {
        if (checkIfReachTarget()) { end(true); return;}
        if (carHP <= 0) {end(false); return;}
        requestAnimationFrame( animate );
        Time.update();
        scene.simulate();
        stats.update();
        physics_stats.update();
        city.update();
        updateCamera();
        updateCampass();
        if (checkViolateTrafficRule()) updateHP(-10);
        render();
    }

    function updateHP(diff) {
        console.log('ViolateTrafficRule');
        carHP += diff;
        document.getElementById('hp_progress').value = carHP;
    }

    function updateCampass() {
        var target_p = new THREE.Vector2(target.position.x, target.position.z);
        var car_d = new THREE.Vector2(car.direction().x, car.direction().z);
        var car_p = new THREE.Vector2(car.position().x, car.position().z);
        var distance = car_p.distanceTo(target_p);
        var angle = Math.acos(car_d.normalize().dot(target_p.sub(car_p).normalize()));
        var side = (target_p.y - car_p.y) * car_d.x - (target_p.x - car_p.x)*car_d.y >= 0 ? 1 : -1;
        //console.log(angle);
        //console.log(distance);
        compass.update(angle * side, distance);
    }

    function updateCamera() {
        //var velocity = car.body.getLinearVelocity();
        var direction = car.direction();
        var position = car.position();
        var camera_distance = 7;
        var camera_height = 10;
        camera.position.x = position.x - direction.x * camera_distance;
        camera.position.y = camera_height;
        camera.position.z = position.z - direction.z * camera_distance;
        camera.lookAt(position);
    }

    function render() {
        var delta = clock.getDelta();
        controls.movementSpeed = 5;
        controls.update( delta );
        //car.setVisible(false);
        //chromeMaterial.visible = false;
        car.ball.visible = false;
        renderer.clear();
        //car.ball.position.x = car.position().x;
        //car.ball.position.z = car.position().z;
        //car.ball.position.y = car.position().y + 0.5;
        //cubeCamera.position.copy(car.ball.position);

        cubeCamera.position.copy(car.ball.getWorldPosition());
        //cubeCamera.rotation.copy(car.ball.getWorldRotation());
        cubeCamera.updateCubeMap( renderer, scene );
        //car.setVisible(true);
        //chromeMaterial.visible = true;
        car.ball.visible = true;
        renderer.render(scene, camera);
    }

    function start() {
        bootbox.prompt({title: "How far is the destination?", value: 3, callback: function(result) {
            distance = result !== null ? parseInt(result) : 3;
            init();
        }});
    }

    function end(win) {
        car.block = true;
        var msg = win ? "You win! Play again?" : "You lose! Play again?";
        bootbox.confirm(msg, function(result) {
            if (result) start();
        });
    }

    function initTarget() {
        console.log('initTarget ' + distance);
        var car_cell = city.map.whichCell(car.position().x, car.position().z);
        var offset_i = randomInt(null, Math.floor(distance*0.25), Math.floor(distance*0.75));
        var offset_j = distance - offset_i;
        var direction_i = random() < 0.5 ? -1 : 1;
        var direction_j = random() < 0.5 ? -1 : 1;
        var target_i = car_cell.i + (offset_i * direction_i);
        var target_j = car_cell.j + (offset_j * direction_j);
        var target_cell = city.map.getCell(target_i, target_j);
        if (target_cell.type == Cell.BLOCK || target_cell.type == Cell.ROAD_INTERSECTION) {
            target_i++;
            target_cell = city.map.getCell(target_i, target_j);
        }
        target = new Target(target_cell.position);
        target.draw(scene);
        target.cell = {i: target_i, j: target_j};
    }

    var previous_cell = null;
    function checkViolateTrafficRule() {
        var current_cell = car.cell(city.map);
        //console.log("i: " + current_cell.i + ", j: " + current_cell.j);
        if (previous_cell === null) {
            previous_cell = current_cell;
            return false;
        }
        if (previous_cell.i == current_cell.i && previous_cell.j == current_cell.j)
            return false;
        var s;
        if (previous_cell.type == Cell.ROAD_HORIZONTAL && current_cell.type == Cell.ROAD_INTERSECTION) {
            s = city.getCellObject(current_cell.i, current_cell.j).getLightStatus().status1;
        }
        // if (previous_cell.type == Cell.ROAD_INTERSECTION && current_cell.type == Cell.ROAD_HORIZONTAL) {
        //     s = city.getCellObject(previous_cell.i, previous_cell.j).getLightStatus().status1;
        // }
        if (previous_cell.type == Cell.ROAD_VERTICAL && current_cell.type == Cell.ROAD_INTERSECTION) {
            s = city.getCellObject(current_cell.i, current_cell.j).getLightStatus().status2;
        }
        // if (previous_cell.type == Cell.ROAD_INTERSECTION && current_cell.type == Cell.ROAD_VERTICAL) {
        //     s = city.getCellObject(previous_cell.i, previous_cell.j).getLightStatus().status2;
        // }
        previous_cell = current_cell;
        return s == 'R';
    }

    function checkIfReachTarget() {
        if (target === undefined) return false;
        var target_p = new THREE.Vector2(target.position.x, target.position.z);
        var car_p = new THREE.Vector2(car.position().x, car.position().z);
        var distance = car_p.distanceTo(target_p);
        //var car_cell = city.map.whichCell(car.position().x, car.position().z);
        //var target_cell = target.cell;
        if (distance < 1)
            return true;
        else
            return false;
    }

    var o = {
        setContainer: setContainer,
        setCompassContainer: setCompassContainer,
        start: start,
        car: function() {return car;},
        cubeCamera: function() {return cubeCamera;},
        scene: function() {return scene;},
        renderer: function() {return renderer;}
    };
    return o;
}(document));
