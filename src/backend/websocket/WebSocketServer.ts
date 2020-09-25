

import ws from "ws";
import {EventEmitter} from "eventemitter3";
import { IWebsocketPacketData } from "../util/interfaces";
import http from "http";

export default class WebSocketServer extends EventEmitter {
    server: ws.Server
    constructor(options: ws.ServerOptions) {
        super();
        this.server = new ws.Server(options);
        this.server.on("connection", (socket, req: http.IncomingMessage) => {
            this.emit("_connect", socket, req);
            socket.on("message", (data: string) => {
                const msg = JSON.parse(data) as IWebsocketPacketData;
                this.emit<any>(msg.e, socket, msg.d);
            });
        });
    }
}