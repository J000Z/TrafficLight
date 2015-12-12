# TrafficLight <sub>[a 3D game made with [three.js](http://threejs.org "three.js") and [Physijs](https://github.com/chandlerprall/Physijs "Physijs")]</sub>
by Jiancheng Zhu

[Demo http://cheng9393.github.io/TrafficLight](http://cheng9393.github.io/TrafficLight "demo")

This is a car simulation game. The user need to control the car with arrow keys and drive it to a given destination whose direction is given by a compass. User can choose the difficulty by define the distance to destination. The car initially has 100 hp. Whenever it moves into a road intersection when the light is red, the car will lose 10 hp. If hp reaches 0, user loses the game.

Use the camera switch on the left bottom corner to switch between car following and fly control(control by mouse drag and keys A, W, S, D, Q, E)

I created a shader for the compass, to simulate a radar animation. It reads an input variable representing an angle varying from 0 to 2*pi, and highlights the sector at that angle.

#### What did I learn?
- use shaders
- use three.js
  - basic object, material, scene, camera
  - mirror
  - skybox


#### What obstacles did I encountered?
 - Get the direction angle of an object (can not simply use mesh.rotation which only varying from 0 to PI) (solved)
 
 ```javascript
 //a local point in desired direction (relative position)
 var pLocal = new THREE.Vector3( -2, 0, 0 );
 //translate to world position (this.body is the body mesh of the car)
 var pWorld = pLocal.applyMatrix4( this.body.matrixWorld );
 //get direction vector
 var dir = pWorld.sub( this.body.position ).normalize();
 ```
 - Make canvas' background transparent (solved)
 - Computation cost (unsolved)


#### Credits
 - Skybox image by macsix
 [http://macsix.deviantart.com/art/Atlantic-Spherical-HDRI-Panorama-Skybox-416316641](http://macsix.deviantart.com/art/Atlantic-Spherical-HDRI-Panorama-Skybox-416316641 "")
 - Constraints, Car - Physijs
 [http://chandlerprall.github.io/Physijs/examples/constraints_car.html](http://chandlerprall.github.io/Physijs/examples/constraints_car.html "")
