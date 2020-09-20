
import WebSocket from "ws";
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
    callback: (req: Express.Request, res: Express.Response) => void
}

interface IWebsocketPacket {
    name: string,
    callback: (socket: WebSocket) => void
}

interface IWebsocketPacketData {
    e: string,
    d: IObject
}