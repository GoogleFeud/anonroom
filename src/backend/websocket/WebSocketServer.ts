

import ws from "ws";
import {EventEmitter} from "eventemitter3";
import { IWebsocketPacketData, ExtendedSocket } from "../util/interfaces";
import http from "http";

export default class WebSocketServer extends EventEmitter {
    server: ws.Server
    constructor(options: ws.ServerOptions) {
        super();
        this.server = new ws.Server(options);
        this.server.on("connection", (socket: ExtendedSocket, req: http.IncomingMessage) => {
            this.emit("_connect", socket, req);
            socket.on("message", (data: string) => {
                const msg = JSON.parse(data) as IWebsocketPacketData;
                this.emit<any>(msg.e, socket, msg.d);
            });

            socket.on("close", (code, reason) => {
                this.emit("_close", socket, code, reason);
            });
         });

    }

    send(socket: ws, event: string|number, data: any) {
        socket.send(JSON.stringify({e: event, d: data}));
    }

}