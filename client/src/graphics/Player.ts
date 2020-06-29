import * as THREE from "three"

import { World } from "./World"

export class Player {

  mesh: THREE.Mesh
  world: World

  constructor(world: World) {

    this.world = world

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
}
