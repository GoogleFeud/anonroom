

import ws from "ws";
import {EventEmitter} from "events";
import { IWebsocketPacketData } from "../util/interfaces";

export default class WebSocketServer extends EventEmitter {
    server: ws.Server
    constructor(options: ws.ServerOptions) {
        super();
        this.server = new ws.Server(options);
        this.server.on("connection", (socket) => {
            socket.on("message", (data: string) => {
                const msg = JSON.parse(data) as IWebsocketPacketData;
                this.emit(msg.e, msg.d);
            });
        });
    }
}