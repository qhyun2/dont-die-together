import * as THREE from "three";
import { PointerLockControls } from "three/examples/jsm/controls/PointerLockControls";
import * as Kontra from "kontra";
import { Network } from "./Network"
import { World } from "./graphics/World"

export class PlayerControls {
  world: World;
  network: Network;
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
    world.scene.add(this.controls.getObject());
  }

  update(): void {
    const speed = 0.1;
    if (Kontra.keyPressed("a")) {
      this.network.room.send("move", { x: -0.1 });
    }
    if (Kontra.keyPressed("d")) {
      this.network.room.send("move", { x: 0.1 });
    }
    if (Kontra.keyPressed("w")) {
      this.network.room.send("move", { z: -0.1 });
    }
    if (Kontra.keyPressed("s")) {
      this.network.room.send("move", { z: 0.1 });
    }

    const player = this.world.players[this.network.room.sessionId].position;
    this.camera.position.set(player.x, player.y + 3, player.z);
  }
}
