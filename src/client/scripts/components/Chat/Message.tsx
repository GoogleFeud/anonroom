import React from "react";
import { MessageData, ParticipantData } from "../../pages/Room";


export function Message(props: IMessageComponentData) {
    const Comp = props.markdownParser(props.raw.content);
    if (props.author) return <p style={{ color: props.author.color }}>{props.author.name}: {...Comp}</p>;
    return (
        <p style={{color: "red", fontWeight: "bold"}}>
            {...Comp}
        </p>
    );
}

export interface IMessageComponentData {
    author?: ParticipantData,
    raw: MessageData,
    markdownParser: (str: string) => any
}