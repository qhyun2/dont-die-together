import * as THREE from "three";
import { PointerLockControls } from "three/examples/jsm/controls/PointerLockControls";
import * as Kontra from "kontra";
import { Network } from "./Network";
import { World } from "./graphics/World";

export class PlayerControls {
  world: World;
  network: Network;
  vec = new THREE.Vector3();
  camera = new THREE.PerspectiveCamera(
    75,
    window.innerWidth / window.innerHeight,
    0.1,
    1000
  );
  controls = new PointerLockControls(this.camera, document.body);

  constructor(world: World, network: Network) {
    this.world = world;
    this.network = network;
    this.world.scene.add(this.controls.getObject());

    // an invisible 'blocker' element is used detect when the pointer should be locked
    const blocker = document.getElementById("blocker")!;
    blocker.addEventListener(
      "click",
      () => {
        this.controls.lock();
      },
      false
    );
    this.controls.addEventListener("lock", () => {
      blocker.style.display = "none";
    });
    this.controls.addEventListener("unlock", () => {
      blocker.style.display = "block";
    });
  }

  update(): void {
    const speed = 0.1;
    const cam = this.controls.getObject();
    if (Kontra.keyPressed("w")) {
      this.vec.setFromMatrixColumn(cam.matrix, 0);
      this.vec.crossVectors(cam.up, this.vec);
      this.vec.multiplyScalar(0.1);
      this.network.room.send("move", { x: this.vec.x, z: this.vec.z });
    }

    const player = this.world.players[this.network.room.sessionId].mesh
      .position;
    this.camera.position.set(player.x, player.y + 3, player.z);
  }
}
