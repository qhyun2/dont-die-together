import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
// import * as Howler from "howler";
// import * as Colyseus from "colyseus.js";
import * as Kontra from "kontra";

var scene = new THREE.Scene();
var camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );
var renderer = new THREE.WebGLRenderer();

renderer.setSize( window.innerWidth, window.innerHeight );
document.body.appendChild( renderer.domElement );


var geometry = new THREE.BoxGeometry();
var material = new THREE.MeshPhysicalMaterial( { color: 0x013FCC } );
var cube = new THREE.Mesh( geometry, material );
scene.add( cube );

camera.position.z = 2;

  const controls = new OrbitControls(camera, renderer.domElement);
  controls.enableDamping = true;
  controls.dampingFactor = 0.25;
  controls.enablePan = false;


  var spotLight = new THREE.DirectionalLight( 0xffffff );
  spotLight.position.set( 6, 10, 8 );
  spotLight.castShadow = true;

  const loader = new THREE.CubeTextureLoader();
      const texture = loader.load([
        require("../skybox/pos-x.png").default,
        require("../skybox/neg-x.png").default,
        require("../skybox/pos-y.png").default,
        require("../skybox/neg-y.png").default,
        require("../skybox/pos-z.png").default,
        require("../skybox/neg-z.png").default
      ]);
      texture
      scene.background = texture;


scene.add( spotLight );


Kontra.init(document.createElement("canvas"));

let loop = Kontra.GameLoop({
    update: update,
    render: render,
});

loop.start();

function update(dt: number) {
    cube.rotation.y += 0.01;
    cube.rotation.x += 0.01;
}

function render() {
    renderer.render( scene, camera );
}

