import WebSocketServer from "../websocket/WebSocketServer";


enum WebSocketEvents {
    HELLO,
    HEARTBEAT,
    HEARTBEAT_ACK,
    MESSAGE_CREATE,
    ROOM_UPDATE,
    PARTICIPANT_KICK,
    PARTICIPANT_UPDATE,
    ROOM_CLOSE
}

export default WebSocketEvents;