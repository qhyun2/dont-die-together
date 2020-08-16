import { Room, Client, updateLobby } from "colyseus";
import { Player } from "./state/Player";
import { World } from "./state/World";

import * as CANNON from "cannon-es";

export class Game extends Room<World> {
  world: CANNON.World;
  players = new Map<string, CANNON.Body>();

  update(delta: number) {
    this.world.step(delta / 1000.0);
    this.players.forEach((val, key) => {
      const pos = val.position;
      this.state.players[key].pos.set(pos.x, pos.y, pos.z);
    });
  }

  onCreate(options: any) {
    console.log("Game room created");
    this.setState(new World());
    this.onMessage("move", (client, move) => {
      const vel = this.players.get(client.sessionId).velocity;
      if (move.x) vel.x += move.x;
      if (move.z) vel.z += move.z;
    });

    this.onMessage("jump", (client) => {
      const vel = this.players.get(client.sessionId).velocity;
      if (Math.round(vel.y) < 1) this.players.get(client.sessionId).velocity.y = 8;
    });

    this.world = new CANNON.World();
    this.world.gravity.set(0, -9.82, 0);
    this.world.broadphase = new CANNON.NaiveBroadphase();

    var groundShape = new CANNON.Plane();
    var groundBody = new CANNON.Body({ mass: 0, shape: groundShape });
    groundBody.position.setZero();
    groundBody.quaternion.setFromEuler(-Math.PI / 2, 0, 0);
    this.world.addBody(groundBody);

    this.setSimulationInterval((d) => this.update(d));
  }

  onJoin(client: Client, options: any) {
    console.log(`Player ${client.sessionId} joined!`);
    this.state.createPlayer(client.sessionId);
    var mass = 5,
      radius = 1;
    var sphereShape = new CANNON.Sphere(radius);
    var sphereBody = new CANNON.Body({ mass: mass, shape: sphereShape });
    sphereBody.position.set(1, 100, 1);
    this.world.addBody(sphereBody); // Step 3
    this.players.set(client.sessionId, sphereBody); }

  onLeave(client: Client, consented: boolean) {
    console.log(`Player ${client.sessionId} left!`);
    this.state.removePlayer(client.sessionId);
    this.players.delete(client.sessionId);
  }

  onDispose() {}
}
