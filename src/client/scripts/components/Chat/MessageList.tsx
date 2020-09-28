
import React from "react";
import { MessageData, RoomData } from "../../pages/Room";
import { Message } from "./Message";

export function MessageList(props: IMessageListProps) {
    return (
        <div className="room-messageList">
            {props.messages.map(m => <Message author={props.room.participants.find(p => p.id === m.authorId)} raw={m}></Message>)}
        </div>
    )
}

export interface IMessageListProps {
    messages: Array<MessageData>,
    room: RoomData
}