import * as Colyseus from "colyseus.js";
import * as Kontra from "kontra";
import { World } from "./graphics/World";

import * as THREE from "three";
function newCube() {
  var geometry = new THREE.SphereBufferGeometry(1, 20, 20);
  var material = new THREE.MeshPhongMaterial({
    color: "purple",
    reflectivity: 1,
    shininess: 140,
  });

  var cube = new THREE.Mesh(geometry, material);
  cube.position.set(0, 1.7 / 2, 0);
  return cube;
}

export class Network {
  world: World;
  // @ts-ignore
  room: Colyseus.Room;
  client = new Colyseus.Client("ws://99.251.116.242:2567");

  constructor(loop: Kontra.GameLoop, world: World) {
    this.world = world;

    this.client
      .joinOrCreate("game_room")
      .then((init_room) => {
        console.log("Connected", this.room);
        this.room = init_room;

        this.room.state.players.onAdd = (player: any, sessionId: string) => {
          console.log("Joined", player, sessionId);
          this.world.players[sessionId] = newCube();
          this.world.scene.add(this.world.players[sessionId]);
        };

        this.room.state.players.onRemove = (player: any, sessionId: string) => {
          console.log("Left", player, sessionId);
          this.world.scene.remove(this.world.players[sessionId]);
          delete this.world.players[sessionId];
        };

        this.room.state.players.onChange = (player: any, sessionId: string) => {
          this.world.players[sessionId].position.set(
            player.x,
            player.y,
            player.z
          );
        };
        loop.start();
      })
  }
}
