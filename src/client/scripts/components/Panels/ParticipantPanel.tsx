import React from "react";
import { Col, ListGroup } from "react-bootstrap";
import { ParticipantData } from "../../pages/Room";
import { WebSocketClient } from "../../websocket/WebSocketClient";

import { Participant } from "../Participant";

export class ParticipantPanel extends React.Component {
    props: ParticipantPanelProps
    constructor(props: ParticipantPanelProps) {
        super(props);
        this.props = props;
        console.log(this.props);
    }

    render() {
        return (
            <Col sm="3">
                <div className="room-ParticipantList">
                    <ListGroup>
                        {this.props.participants.map(p => <Participant participant={p}></Participant>)}
                    </ListGroup>
                </div>
            </Col>
        )
    }
}


export interface ParticipantPanelProps {
    ws: WebSocketClient
    participants: Array<ParticipantData>
    thisParticipant: ParticipantData
}