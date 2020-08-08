import { Schema, type } from "@colyseus/schema";

export class Vector extends Schema {
    @type("number")
    x = 0;

    @type("number")
    y = 0;

    @type("number")
    z = 0;
}