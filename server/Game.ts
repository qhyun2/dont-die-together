import { Room, Client } from "colyseus";
import { Player } from "./state/Player";
import { World } from "./state/World";

export class Game extends Room<World> {

  onCreate (options: any) {
    console.log("Game room created");

    this.setState(new World());

    this.onMessage("move", (client, data) => {
      console.log("Moving");
      this.state.movePlayer(client.sessionId, data);
    });

    this.onMessage("test", (client, data) => {
      console.log(client, data)
    })
  }

  onJoin (client: Client, options: any) {
    console.log(`Player ${client.sessionId} joined!`)
    this.state.createPlayer(client.sessionId)
  }

  onLeave (client: Client, consented: boolean) {
    console.log(`Player ${client.sessionId} left!`)
    this.state.removePlayer(client.sessionId)
  }

  onDispose() {
  }

}
