import WebSocketServer from "../websocket/WebSocketServer";


enum WebSocketEvents {
    HELLO,
    HEARTBEAT,
    HEARTBEAT_ACK,
    MESSAGE_CREATE,
    ROOM_UPDATE,
    PARTICIPANT_KICK,
    PARTICIPANT_UPDATE,
    PARTICIPANT_JOIN,
    PARTICIPANT_OFFLINE,
    PARTICIPANT_ONLINE,
    ROOM_CLOSE
}

export default WebSocketEvents;