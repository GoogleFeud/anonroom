import React from "react";
import { MessageData, ParticipantData } from "../../pages/Room";


export function Message(props: IMessageComponentData) {
    if (props.author) return <p style={{ color: props.author.color }}>{props.author.name}: {props.raw.content}</p>
    return (
        <p style={{color: "red", fontWeight: "bold"}}>{props.raw.content}</p>
    )
}

export interface IMessageComponentData {
    author?: ParticipantData,
    raw: MessageData
}