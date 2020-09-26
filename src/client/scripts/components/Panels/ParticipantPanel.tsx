import React from "react";
import { Col, ListGroup } from "react-bootstrap";
import { ParticipantData } from "../../pages/Room";
import { WebSocketClient } from "../../websocket/WebSocketClient";
import { EVENT_CODES } from "../../websocket/handleSocketState";

import { Participant } from "../Participant";

export class ParticipantPanel extends React.Component {
    props: ParticipantPanelProps
    state: ParticipantPanelState
    constructor(props: ParticipantPanelProps) {
        super(props);
        this.props = props;

        this.state = {
            participants: this.props.participants
        }

    }

    componentDidMount() {
        this.props.ws.on<any>(EVENT_CODES.PARTICIPANT_UPDATE, (data: ParticipantUpdateEventData) => {
            this.setState((state: ParticipantPanelState) => {
                const participant = state.participants.find(p => data.id === p.id);
                if (!participant) return;
                Object.assign(participant, data);
                return state;
            });
        });
    }

    render() {
        return (
            <Col sm="3">
                <div className="room-ParticipantList">
                    <ListGroup>
                        {this.props.participants.map(p => <Participant participant={p} thisParticipant={this.props.thisParticipant}></Participant>)}
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

export interface ParticipantPanelState {
    participants: Array<ParticipantData>
}

export interface ParticipantUpdateEventData {
    id: string,
    banned?: boolean,
    color?: boolean,
    admin?: boolean,
    online?: boolean,
    muted?: boolean
}

