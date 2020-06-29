import * as Colyseus from "colyseus.js";
import * as Kontra from "kontra";
import * as THREE from "three";

import { World } from "./graphics/World";
import { Player } from "./graphics/Player";

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
          this.world.players[sessionId] = new Player(world);
        };

        this.room.state.players.onRemove = (player: any, sessionId: string) => {
          console.log("Left", player, sessionId);
          this.world.players[sessionId].remove();
          delete this.world.players[sessionId];
        };

        this.room.state.players.onChange = (player: any, sessionId: string) => {
          this.world.players[sessionId].mesh.position.set(
            player.x,
            player.y,
            player.z
          );
        };
        loop.start();
      })
  }
}
