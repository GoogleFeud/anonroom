import React from "react";
import { Col, ListGroup } from "react-bootstrap";
import { ParticipantData } from "../../pages/Room";
import { WebSocketClient } from "../../websocket/WebSocketClient";
import { EVENT_CODES } from "../../websocket/handleSocketState";

import { Participant } from "../Participant";

export class ParticipantPanel extends React.Component {
    props: IParticipantPanelProps
    state: IParticipantPanelState
    constructor(props: IParticipantPanelProps) {
        super(props);
        this.props = props;

        this.state = {
            participants: this.props.participants
        }

    }

    componentDidMount() {
        this.props.ws.on<any>(EVENT_CODES.PARTICIPANT_UPDATE, (data: IParticipantUpdateEventData) => {
            this.setState((state: IParticipantPanelState) => {
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


export interface IParticipantPanelProps {
    ws: WebSocketClient
    participants: Array<ParticipantData>
    thisParticipant: ParticipantData
}

export interface IParticipantPanelState {
    participants: Array<ParticipantData>
}

export interface IParticipantUpdateEventData {
    id: string,
    banned?: boolean,
    color?: boolean,
    admin?: boolean,
    online?: boolean,
    muted?: boolean
}

