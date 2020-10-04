

// This should start up the server
import { ExtendedSocket, IConfig } from "./util/interfaces";

// eslint-disable-next-line @typescript-eslint/no-var-requires
const config = require("../../config.json") as IConfig;

import startServer from "./server/index";
import startWebSocketServer from "./websocket/index";
import Database from "./database/index";

import WebSocketEvents from "./util/websocketEvents";

const db = new Database(config.dbUsername, config.dbPassword);

db.connect().then(() => {
    const server = startServer(config.port, db, () => console.log("Server ready!"));
    const ws = startWebSocketServer(server, db, config.websocketPath);

    setInterval(() => {
        let socket: ExtendedSocket;
        const clients = ws.server.clients as Set<ExtendedSocket>;
        for (socket of clients) {
            if (!socket.isAlive) {
                socket.close(4001);
            }else {
                socket.isAlive = false;
                ws.send(socket, WebSocketEvents.HEARTBEAT, {});
            }
        }
    }, config.heartbeatInterval);
});

