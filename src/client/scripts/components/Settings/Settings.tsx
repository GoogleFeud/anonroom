


import React from "react";
import { RoomData } from "../../pages/Room";


export function Settings(props: ISettingsProps) {
    return (
        <div className="room-controls-modal">
            <button className="room-controls-button" onClick={props.onLockChatClick}>{props.room.chatLocked ? "Unlock":"Lock"} Chat</button>
            <button className="room-controls-button" onClick={props.onLockRoomClick}>{props.room.roomLocked ? "Unlock":"Lock"} Room</button>
            <div className="formField">
                <span>Max participants:</span> 
                <input type="number" className="room-controls-input" defaultValue={props.room.maxParticipants} onChange={e => {
                    if (!e.target) return;
                    props.onMaxParticipantsChange(Number(e.target.value));
                }}></input>
            </div>
            <div className="formField">
                <span>Discord webhook link:</span> 
                <input type="text" className="room-controls-input" defaultValue={props.room.discordWebhook} onChange={e => {
                    if (!e.target) return;
                    props.onDiscordWebhookChange(e.target.value);
                }}></input>
            </div>
        </div>
    )
}

export interface ISettingsProps {
  room: RoomData
  onLockChatClick: () => void
  onLockRoomClick: () => void
  onMaxParticipantsChange: (newVal: number) => void
  onDiscordWebhookChange: (newVal: string) => void
}