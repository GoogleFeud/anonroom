
import http from "http";
import WebSocketServer from "./WebSocketServer";
import { IWebsocketPacket} from "../util/interfaces";
import {getFilesFromDir} from "../util/utils";
import Database from "../database";


export default (server: http.Server, db: Database, path?: string) => {
    const Ws = new WebSocketServer({server, path});

    const packets = getFilesFromDir(__dirname + "/packets");
    for (const packet of packets) {
        // eslint-disable-next-line @typescript-eslint/no-var-requires
        const packetObj = require(`./packets/${packet}`).default as IWebsocketPacket;
        Ws.on(packetObj.name, packetObj.callback.bind(null, db, Ws));
    }

    return Ws;
};