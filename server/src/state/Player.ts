import { Schema, type } from "@colyseus/schema";
import { Vector } from "./Vector"

export class Player extends Schema {
    @type(Vector)
    pos = new Vector();
}