import { createWebSocketStream } from "ws";
import { WebSocketClient } from "./WebSocketClient";

export enum EVENT_CODES {
    HELLO,
    HEARTBEAT,
    HEARTBEAT_ACK,
    MESSAGE_CREATE,
    ROOM_UPDATE,
    PARTICIPANT_KICK,
    PARTICIPANT_UPDATE,
    ROOM_CLOSE
}

export function handleSocketState(socket: WebSocketClient) {
    let heartbeatInterval: number;
    let heartbeatTimeout: NodeJS.Timeout;

    socket.on<any>(EVENT_CODES.HELLO, (data: HelloEventData) => {
         socket.isAlive = true;
         heartbeatInterval = data.heartbeatInterval;
    });

    socket.on<any>(EVENT_CODES.HEARTBEAT, () => {
        clearTimeout(heartbeatTimeout);
        socket.send(EVENT_CODES.HEARTBEAT, {});

        heartbeatTimeout = setTimeout(() => {
            socket._ws.close();
        }, heartbeatInterval);
    });

}


export interface HelloEventData {
    heartbeatInterval: number
}