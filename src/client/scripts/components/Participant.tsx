import React from "react";
import { ParticipantData } from "../pages/Room";
import {ListGroupItem, Badge} from "react-bootstrap";

function badgeResolver(participant: ParticipantData, thisParticipant: ParticipantData) : Array<JSX.Element> {
    const res = []
    if (participant.id === thisParticipant.id) res.push(<Badge>you</Badge>);
    if (participant.admin) res.push(<Badge className="badge-admin">admin</Badge>);
    if (participant.muted) res.push(<Badge className="badge-muted">muted</Badge>);
    if (participant.banned) res.push(<Badge className="badge-banned">banned</Badge>);
    return res;
} 

export function Participant(props: IParticipantProps) {
    return(
        <ListGroupItem>
        <span className={`badge-status-${props.participant.online ? "online":"offline"}`}></span>
        <span style={{color: props.participant.color}}>{props.participant.name}</span>
        {...badgeResolver(props.participant, props.thisParticipant)}
       </ListGroupItem>
    )
}


export interface IParticipantProps {
    participant: ParticipantData,
    thisParticipant: ParticipantData
}