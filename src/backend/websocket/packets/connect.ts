import Database from "../../database";

import CustomDatabase from "../../database";
import WebSocket from "ws";

export default {
    name: "_connect",
    callback: (db: CustomDatabase, socket: WebSocket) => {
        console.log("New connection!");
    }
}