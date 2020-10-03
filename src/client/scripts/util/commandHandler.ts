import { WebSocketClient } from "../websocket/WebSocketClient";
import {post} from "./fetch";
import { ParticipantData, RoomData } from "../pages/Room";
import { sendClientMessage } from "./util";

export async function Handler(message: string, prefix: string, ws: WebSocketClient, room: RoomData, you: ParticipantData) {
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
        break;
    }
    case "announce": {
        if (!args.length) return sendClientMessage(ws, "Please provide a message!");
        if (!you.admin) return sendClientMessage(ws, "You must be an admin to use this command!");
        const res = await post<undefined>(`/room/${room.id}/messages`, {
            content: args.join(" "),
            system: true
        });
        if (res && "error" in res) return sendClientMessage(ws, res.error);
        break;
    }
    default: {
        alert("Invalid command!");
    }
    }
}

export const ALL_COMMANDS = ["admin", "announce"];