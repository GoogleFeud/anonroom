import React from "react";
import { ParticipantData } from "../pages/Room";
import {ListGroupItem, Badge} from "react-bootstrap";

function badgeResolver(participant: ParticipantData) : Array<JSX.Element> {
    const res = []
    if (participant.admin) res.push(<Badge className="badge-admin">admin</Badge>);
    if (participant.muted) res.push(<Badge className="badge-muted">muted</Badge>);
    if (participant.banned) res.push(<Badge className="badge-banned">banned</Badge>);
    return res;
} 

export function Participant(props: ParticipantProps) {
    return(
        <ListGroupItem>
        <span style={{color: props.participant.color}}>{props.participant.name}</span>
        {...badgeResolver(props.participant)}
       </ListGroupItem>
    )
}


export interface ParticipantProps {
    participant: ParticipantData
}