


import React from "react";
import { RoomData } from "../../pages/Room";


export function Settings(props: ISettingsProps) {
    return (
        <div className="room-controls-modal">
            <button className="room-controls-button" onClick={props.onLockChatClick}>{props.room.chatLocked ? "Unlock":"Lock"} Chat</button>
            <button className="room-controls-button" onClick={props.onLockRoomClick}>{props.room.roomLocked ? "Unlock":"Lock"} Room</button>
            <div className="formField">
                <span>Max participants:</span> 
                <input type="text" className="room-controls-input" defaultValue={props.room.maxParticipants || 0} onBlur={e => {
                    if (!e.target) return;
                    const value = Number(e.target.value);
                    if (value === props.room.maxParticipants) return;
                    props.onMaxParticipantsChange(Number(e.target.value), e.target);
                }} onKeyPress={(e: React.KeyboardEvent<HTMLInputElement>) => {
                    if (e.key === "Enter") {
                        const target = e.target as HTMLInputElement;
                        props.onMaxParticipantsChange(Number(target.value), target);
                        target.blur();
                    }
                }}></input>
            </div>
            <div className="formField">
                <span>Discord webhook link:</span> 
                <input type="text" className="room-controls-input" defaultValue={props.room.discordWebhook} onBlur={e => {
                    if (!e.target) return;
                    props.onDiscordWebhookChange(e.target.value, e.target);
                }} onKeyPress={(e: React.KeyboardEvent<HTMLInputElement>) => {
                    if (e.key === "Enter") {
                        const target = e.target as HTMLInputElement;
                        props.onDiscordWebhookChange(target.value, target);
                        target.blur();
                }
            }}></input>
            </div>
            <button className="room-controls-button" onClick={props.onRoomDeleteClick}>Delete Room</button>
        </div>
    )
}

export interface ISettingsProps {
  room: RoomData
  onLockChatClick: () => void
  onLockRoomClick: () => void
  onRoomDeleteClick: () => void
  onMaxParticipantsChange: (newVal: number, e: HTMLInputElement) => void
  onDiscordWebhookChange: (newVal: string, e: HTMLInputElement) => void
}