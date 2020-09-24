

import ws from "ws";
import {EventEmitter} from "eventemitter3";
import { IWebsocketPacketData } from "../util/interfaces";

export default class WebSocketServer extends EventEmitter {
    server: ws.Server
    constructor(options: ws.ServerOptions) {
        super();
        this.server = new ws.Server(options);
        this.server.on("connection", (socket) => {
            this.emit("_connect", socket);
            socket.on("message", (data: string) => {
                const msg = JSON.parse(data) as IWebsocketPacketData;
                this.emit(msg.e, socket, msg.d);
            });
        });
    }
}