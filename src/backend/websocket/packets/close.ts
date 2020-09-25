

import CustomDatabase from "../../database";
import WebSocketServer from "../WebSocketServer";

import WebSocketEvents from "../../util/websocketEvents";
import { ExtendedSocket } from "../../util/interfaces";

export default {
    name: "_close",
    callback: async (db: CustomDatabase, WsServer: WebSocketServer, socket: ExtendedSocket) => {
        if (!socket.participant) return;
        const room = socket.participant.room;
        // TBD
    }
}
