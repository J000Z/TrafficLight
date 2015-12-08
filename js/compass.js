function Compass(container){
    var scene = new THREE.Scene();
    var camera = new THREE.PerspectiveCamera(28, 1, 1, 10000);
    camera.position.z = 100;
    var tick = 0;
    var clock = new THREE.Clock(true);
    var particleSystem = new THREE.GPUParticleSystem({maxParticles: 250000});
    scene.add(particleSystem);
    var options1 = {
      position: new THREE.Vector3(),
      positionRandomness: 0.3,
      velocity: new THREE.Vector3(),
      velocityRandomness: 0,
      color: 0x00AB14,
      colorRandomness: 0.2,
      turbulence: 0,
      lifetime: 3,
      size: 5,
      sizeRandomness: 1
    };
    var options2 = {
      position: new THREE.Vector3(),
      positionRandomness: 1.0,
      velocity: new THREE.Vector3(),
      velocityRandomness: 0,
      color: 0xFF0000,
      colorRandomness: 0.2,
      turbulence: 0,
      lifetime: 1,
      size: 1.4,
      sizeRandomness: 16
    };
    var spawnerOptions = {
      spawnRate: 1000,
      horizontalSpeed: 1.5,
      verticalSpeed: 1.33,
      timeScale: 1
    };
    var renderer = new THREE.WebGLRenderer({precision: 'lowp', alpha: true});
    renderer.setClearColor( 0x000000, 0 ); // the default
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(container.offsetWidth, container.offsetHeight);
    container.appendChild(renderer.domElement);
    container.style.background =  "transparent";

    var pin = {angle: 1, distance: 0};
    var world_radius = 10;
    var interval = 2;
    var radius = 20;

    function animate() {
      requestAnimationFrame(animate);
      var delta = clock.getDelta();
      tick += delta;


      if (tick < 0) tick = 0;

      if (delta > 0) {
          var x;

        options1.position.x = Math.sin(Math.PI*2/interval*(tick % interval)) * radius;
        options1.position.y = Math.cos(Math.PI*2/interval*(tick % interval)) * radius;
        options1.position.z = 0; //Math.sin(tick * spawnerOptions.horizontalSpeed + spawnerOptions.verticalSpeed) * 5;

        for (x = 0; x < spawnerOptions.spawnRate; x++) {
          particleSystem.spawnParticle(options1);
        }

        var pin_radius = pin.distance > world_radius ? radius+0.5 : (pin.distance/world_radius)*radius;
        options2.position.x = Math.sin(pin.angle) * pin_radius;
        options2.position.y = Math.cos(pin.angle) * pin_radius;
        options2.position.z = 0;
        if (tick % 2 > 1.5) {
            for (x = 0; x < spawnerOptions.spawnRate; x++) {
              particleSystem.spawnParticle(options2);
            }
        }

      }

      particleSystem.update(tick);
      renderer.render(scene, camera);
    }
    animate();

    this.update = function(angle, distance) {
        pin.angle = angle;
        pin.distance = distance;
    };
}
