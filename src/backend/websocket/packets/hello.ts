
import WebSocket from "ws";
import Database from "../../database";

export default {
    name: "hello",
    callback: (database: Database, socket: WebSocket) => {
        console.log("HELLO!");
    }
}