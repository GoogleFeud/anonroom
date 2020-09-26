

import CustomDatabase from "../../database";
import WebSocketServer from "../WebSocketServer";

import WebSocketEvents from "../../util/websocketEvents";
import { ExtendedSocket } from "../../util/interfaces";

export default {
    name: "_close",
    callback: async (db: CustomDatabase, WsServer: WebSocketServer, socket: ExtendedSocket) => {
        if (!socket.participant) return;
        const room = socket.participant.room;
        const allPSocket = room.sockets.get(socket.participant.id);
        if (!allPSocket) return;
        allPSocket.delete(socket.id);
        if (!allPSocket.size) {
            room.sockets.delete(socket.participant.id);
            room.sendToAllSockets(WebSocketEvents.PARTICIPANT_UPDATE, {id: socket.participant.id, online: false});
        }
    }
}
