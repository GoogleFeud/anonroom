
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
    e: string,
    d: IObject
}

interface Config {
    dbUsername: string,
    dbPassword: string
}

interface IRequestWithBody extends Express.Request {
    body: IObject
}