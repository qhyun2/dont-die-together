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


var spotLight = new THREE.SpotLight( 0xffffff );
spotLight.position.set( 100, 1000, 100 );

spotLight.castShadow = true;

spotLight.shadow.mapSize.width = 1024;
spotLight.shadow.mapSize.height = 1024;

spotLight.shadow.camera.near = 500;
spotLight.shadow.camera.far = 4000;
spotLight.shadow.camera.fov = 30;

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

