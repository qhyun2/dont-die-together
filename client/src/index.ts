import * as THREE from "three";
import * as HOWLER from "howler";
import * as Colyseus from "colyseus.js";
import * as KONTRA from "kontra";


const a = new THREE.Mesh();
const b = new HOWLER.Howl({});
const c = new Colyseus.Client();
const d = KONTRA.GameLoop({update: () => {}, render: () => {}});

console.log(a)
console.log(b)
console.log(c)
console.log(d)


