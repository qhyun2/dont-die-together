import * as THREE from "three";
import Ola from "ola";

import { World } from "./World";

export class Player {
  mesh: THREE.Mesh;
  world: World;
  pos: Ola;

  constructor(world: World) {
    this.world = world;
    this.pos = new Ola({ x: 0, y: 0, z: 0 });

    var geometry = new THREE.SphereBufferGeometry(1, 20, 20);
    var material = new THREE.MeshPhongMaterial({
      color: "purple",
      reflectivity: 1,
      shininess: 140,
    });

    this.mesh = new THREE.Mesh(geometry, material);
    this.world.scene.add(this.mesh);
  }

  remove() {
    this.world.scene.remove(this.mesh);
  }

  update() {
    this.mesh.position.set(this.pos.x, this.pos.y, this.pos.z);
  }
}
