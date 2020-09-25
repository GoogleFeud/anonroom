
import WebSocket from "ws";
import Database from "../database/index";

/** ICollectable is any object which has an id property*/
interface ICollectable {
    [key: string]: any,
    id: string
}

interface IObject {
    [key: string]: any
}

interface IExpressRoute {
    path: string,
    method: "get"|"post"|"patch"|"delete",
    callback: (db: Database, req: Express.Request, res: Express.Response) => void
}

interface IWebsocketPacket {
    name: string,
    callback: (db: Database, socket: WebSocket) => void
}

interface IWebsocketPacketData {
    e: string|number,
    d: IObject
}

interface IConfig {
    dbUsername: string,
    dbPassword: string,
    websiteURL: string,
    websocketPath: string
}

interface IRequestWithBody extends Express.Request {
    body: IObject
}

interface ConnectEventQuery {
    roomId?: string,
    participantId?: string
}