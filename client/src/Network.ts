import * as Colyseus from "colyseus.js";
import * as Kontra from "kontra";
import * as THREE from "three";

import { World } from "./graphics/World";
import { Player } from "./graphics/Player";

// let typescript know server url populated by webpack
declare var __SERVER_URL__: string;

export class Network {
  world: World;
  // @ts-ignore
  room: Colyseus.Room;
  client: Colyseus.Client;

  constructor(loop: Kontra.GameLoop, world: World) {
    this.world = world;

    this.client = new Colyseus.Client(__SERVER_URL__);

    // start a websocket connection with server
    this.client.joinOrCreate("game_room").then((room) => {
      this.room = room;
      console.log("Connected", this.room);

      this.room.state.players.onAdd = (player: any, sessionId: string) => {
        console.log("Joined", player, sessionId);
        this.world.players[sessionId] = new Player(world);
        if (sessionId === room.sessionId) {
          loop.start();
        }
      };

      this.room.state.players.onRemove = (player: any, sessionId: string) => {
        console.log("Left", player, sessionId);
        this.world.players[sessionId].remove();
        delete this.world.players[sessionId];
      };

      this.room.state.players.onChange = (player: any, sessionId: string) => {
        this.world.players[sessionId].pos.set({
          x: player.pos.x,
          y: player.pos.y,
          z: player.pos.z,
        });
      };
    });
  }
}
