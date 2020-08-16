import * as THREE from "three";
import { PointerLockControls } from "three/examples/jsm/controls/PointerLockControls";
import * as Kontra from "kontra";
import { Network } from "./Network";
import { World } from "./graphics/World";

export class PlayerControls {
  world: World;
  network: Network;
  vec = new THREE.Vector3();
  move = new THREE.Vector3();
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
    const player = this.world.players[this.network.room.sessionId].pos;
    this.camera.position.set(player.x, player.y + 3, player.z);

    //
    // player movement
    //
    const zMove =
      Number(Kontra.keyPressed("w")) - Number(Kontra.keyPressed("s"));
    const xMove =
      Number(Kontra.keyPressed("d")) - Number(Kontra.keyPressed("a"));

    const cam = this.controls.getObject();
    this.move.set(0, 0, 0);

    // add x axis movement to total movement
    this.vec.setFromMatrixColumn(cam.matrix, 0);
    this.move.addScaledVector(this.vec, xMove);

    // add z axis movement to total movement
    this.vec.crossVectors(cam.up, this.vec);
    this.move.addScaledVector(this.vec, zMove);

    if (Kontra.keyPressed("space")) this.network.room.send("jump")

    if (zMove || xMove) {
      const speed = 0.1;
      this.move.multiplyScalar(speed);
      this.network.room.send("move", { x: this.move.x, z: this.move.z });
    }
  }
}
