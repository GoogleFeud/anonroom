

import React from "react";
import { RoomData } from "../../pages/Room";

export function Mention(props: IMentionsProps) {
    const participant = props.room.participants.find(p => p.name === props.name);
    if (participant) return <span style={{backgroundColor: participant.color + "90", margin: "2px 2px 2px 2px", color: participant.color}}>{props.name}</span>;
    else return <span>{props.name}</span>;
}

export interface IMentionsProps {
    name: string,
    room: RoomData
}