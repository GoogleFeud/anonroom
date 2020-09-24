
import {EventEmitter} from "eventemitter3";


export class WebSocketWrapper extends EventEmitter {
    _ws: WebSocket
    constructor(url: string) {
        super();
        this._ws = new WebSocket(url);
        this._ws.onopen = () => {
            this.emit("open");
            this._ws.onmessage = (data: MessageEvent<string>) => {
                const jsData = JSON.parse(data.data) as IWebsocketPacketData;
                this.emit(jsData.e, jsData.d);
            }
        }
    }

    send(packetName: string, data: any) {
        this._ws.send(JSON.stringify({e: packetName, d: data}));
    }

    
}


export interface IWebsocketPacketData {
    e: string,
    d: any
}