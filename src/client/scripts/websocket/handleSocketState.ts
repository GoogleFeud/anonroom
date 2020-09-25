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

    socket.on<any>(EVENT_CODES.HELLO, (data: HelloEventData) => {
         socket.isAlive = true;
         heartbeatInterval = data.heartbeatInterval;
    });

    

}


export interface HelloEventData {
    heartbeatInterval: number
}