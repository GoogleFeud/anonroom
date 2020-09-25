import CustomDatabase from "../../database";
import WebSocketServer from "../WebSocketServer";

import WebSocketEvents from "../../util/websocketEvents";
import { ExtendedSocket } from "../../util/interfaces";

export default {
    name: WebSocketEvents.HEARTBEAT,
    callback: async (db: CustomDatabase, WsServer: WebSocketServer, socket: ExtendedSocket) => {
        //console.log("Heartbeat received!");
        socket.isAlive = true;
    }
}
