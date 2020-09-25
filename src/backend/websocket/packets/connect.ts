import Database from "../../database";

import CustomDatabase from "../../database";
import WebSocket from "ws";
import http from "http";
import url from "url";
import { ConnectEventQuery } from "../../util/interfaces";

const HEARTBEAT_INTERVAL = 450000;

export default {
    name: "_connect",
    callback: async (db: CustomDatabase, socket: WebSocket, req: http.IncomingMessage) => {
        const query = url.parse(req.url || "", true).query as ConnectEventQuery;
        if (!query.participantId || !query.roomId) return socket.close(1007);
        const room = await db.rooms.get(query.roomId);
        if (!room) return socket.close(1007);
        if (!room.participants.has(query.participantId)) return socket.close(1007);
        socket.send(JSON.stringify({e: 0, d: {heartbeatInterval: HEARTBEAT_INTERVAL}}))
    }
}
