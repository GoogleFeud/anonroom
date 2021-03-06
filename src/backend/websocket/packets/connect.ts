
import CustomDatabase from "../../database";
import http from "http";
import url from "url";
import { ConnectEventQuery, ExtendedSocket, IConfig } from "../../util/interfaces";
import WebSocketServer from "../WebSocketServer";
import WebSocketEvents from "../../util/websocketEvents";

import {parseCookies} from "../../util/utils";

import {v4} from "uuid";

// eslint-disable-next-line @typescript-eslint/no-var-requires
const config = require("../../../config.json") as IConfig;

export default {
    name: "_connect",
    callback: async (db: CustomDatabase, WsServer: WebSocketServer, socket: ExtendedSocket, req: http.IncomingMessage) => {
        const query = url.parse(req.url || "", true).query as ConnectEventQuery;
        if (!query.roomId) return socket.close(1014);
        const room = await db.rooms.get(query.roomId);
        if (!room) return socket.close(1014);
        const cookies = parseCookies(req);
        const participant = room.participantsBySecret.get(cookies[room.id]);
        if (!participant) return socket.close(1014);
        socket.isAlive = true;
        socket.participant = participant;
        socket.id = v4();
        if (!participant.isOnline()) room.sendToAllSockets(WebSocketEvents.PARTICIPANT_UPDATE, {id: participant.id, online: true});
        room.addSocket(participant, socket);
        WsServer.send(socket, WebSocketEvents.HELLO, {e: 0, d: {heartbeatInterval: config.heartbeatInterval}});
    }
};

