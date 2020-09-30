import { WebSocketClient } from "../websocket/WebSocketClient";
import {EVENT_CODES} from "../websocket/handleSocketState";
import {post} from "./fetch";
import { ParticipantData, RoomData } from "../pages/Room";

export default async (message: string, prefix: string, ws: WebSocketClient, room: RoomData, you: ParticipantData) => {
    //   if (!message.startsWith("/")) return; <------ This should get checked in the ChatPanel component.
    const [command, ...args] = message.slice(prefix.length).replace(/\s+/g, " ").trim().split(/ +/);
    switch(command.toLowerCase()) {
    case "admin": {
        if (!args.length) return sendClientMessage(ws, "Please provide a password!");
        if (you.admin) return sendClientMessage(ws, "You are already admin!");
        const password = args[0];
        if (password.length < 6) return sendClientMessage(ws, "The passowrd is at least 6 charatcers long!");
        if (password.length > 16) return sendClientMessage(ws, "Password length cannot exceed 16 characters!");
        const res = await post<undefined>(`/room/${room.id}/participants/${you.id}/admin?password=${encodeURI(password)}`, {});
        if (res && "error" in res) return sendClientMessage(ws, res.error);
    }
    }
};

function sendClientMessage(ws: WebSocketClient, content: string) : boolean {
    ws.emit<any>(EVENT_CODES.MESSAGE_CREATE, {content, sentAt: Date.now()});
    return true;
}