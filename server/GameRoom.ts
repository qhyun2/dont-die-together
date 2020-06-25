import { Room, Client } from "colyseus";

export class GameRoom extends Room {

  onCreate (options: any) {
    console.log(options)

    this.onMessage("type", (client, message) => {
      console.log(client, message)
    });

  }

  onJoin (client: Client, options: any) {
    console.log(client, options)
  }

  onLeave (client: Client, consented: boolean) {
    console.log(client, consented)
  }

  onDispose() {
  }

}
