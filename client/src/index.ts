import * as THREE from "three";
import * as Colyseus from "colyseus.js";
import * as Kontra from "kontra";
import "./Sound";
import { World } from "./graphics/World";
import { PlayerControls } from "./PlayerControls";
import { Network } from "./Network";

Kontra.init(document.createElement("canvas"));
Kontra.initKeys();

// main game loop
let loop = Kontra.GameLoop({
  update: update,
  render: render,
});

// renderer
var renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.shadowMap.enabled = true;
document.body.appendChild(renderer.domElement);

// instantiate classes
const world = new World();
const networking = new Network(loop, world);
const playerControls = new PlayerControls(world, networking);



function createElement(feature) {
  var market = feature.geometry.coordinates[0]
  var shape = new THREE.Shape()
  var transX = x => (x + 80.486) * 30000
  var transY = y => (y - 43.449) * 30000
  market = market.map(e => [transX(e[0]), transY(e[1])])


  shape.moveTo(market[0][0], market[0][1])
  market.forEach(element => {
    shape.lineTo(element[0], element[1])
  });
  shape.lineTo(market[market.length - 1][0], market[market.length - 1][1])

  var depth = feature.properties['building:levels']
  depth = (depth === undefined) ? 1 : depth;
  depth *= 7;

  var geo = new THREE.ExtrudeBufferGeometry(shape, {depth: depth, bevelEnabled: false})
  var mat = new THREE.MeshLambertMaterial({color: 0x91876b});
  var mesh = new THREE.Mesh(geo, mat);
  mesh.rotation.x -= Math.PI / 2;
  mesh.castShadow = true
  mesh.receiveShadow = true
  // mesh.position.y += depth;

  world.scene.add(mesh)
}

import data from './../res/map.json';

data.features.forEach(element => createElement(element))

function update() {
  world.update();
  playerControls.update();
}

function render() {
  renderer.render(world.scene, playerControls.camera);
}
