
import CustomDatabase from "../../database";
import http from "http";
import url from "url";
import { ConnectEventQuery, ExtendedSocket, IConfig } from "../../util/interfaces";
import WebSocketServer from "../WebSocketServer";

const config = require("../../../config.json") as IConfig;

export default {
    name: "_connect",
    callback: async (db: CustomDatabase, WsServer: WebSocketServer, socket: ExtendedSocket, req: http.IncomingMessage) => {
        const query = url.parse(req.url || "", true).query as ConnectEventQuery;
        if (!query.participantId || !query.roomId) return socket.close(1014);
        const room = await db.rooms.get(query.roomId);
        if (!room) return socket.close(1014);
        const participant = room.participants.get(query.participantId);
        if (!participant) return socket.close(1014);
        participant.socket = socket;
        socket.isAlive = true;
        socket.participant = participant;
        socket.send(JSON.stringify({e: 0, d: {heartbeatInterval: config.heartbeatInterval}}))
    }
}
