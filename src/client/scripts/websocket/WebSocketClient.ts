
import {EventEmitter} from "eventemitter3";


export class WebSocketClient extends EventEmitter {
    _ws: WebSocket
    isAlive: boolean
    constructor(url: string, history: any) {
        super();
        this._ws = new WebSocket(url);
        this.isAlive = false;
        this._ws.onopen = () => {
            this.emit("open");
            this._ws.onmessage = (data: MessageEvent<string>) => {
                const jsData = JSON.parse(data.data) as IWebsocketPacketData;
                this.emit<any>(jsData.e, jsData.d);
            }
            this._ws.onclose = (e: CloseEvent) => {
                if (e.code === 4001) return history.push("/");
                console.log(`WEBSOCKET ERROR ${e.code}`);
            }
        }
    }

    close(code?: number) {
        this._ws.close(code);
    }

    send(packetName: string|number, data: any) {
        this._ws.send(JSON.stringify({e: packetName, d: data}));
    }


}


export interface IWebsocketPacketData {
    e: string|number,
    d: any
}