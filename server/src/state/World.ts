import { Schema, MapSchema, type } from "@colyseus/schema";
import { Player } from "./Player"

export class World extends Schema {
    @type({ map: Player })
    players = new MapSchema<Player>();

    createPlayer (id: string) {
        this.players[id] = new Player();
    }

    removePlayer (id: string) {
        delete this.players[id];
    }

    movePlayer (id: string, movement: any) {
        if (movement.x) {
            this.players[id].pos.x += movement.x;
        }
        if (movement.z) {
            this.players[id].pos.z += movement.z;
        }
    }
}