import React from "react";
import { Col, ListGroup } from "react-bootstrap";
import { ParticipantData } from "../../pages/Room";
import { WebSocketClient } from "../../websocket/WebSocketClient";
import { EVENT_CODES } from "../../websocket/handleSocketState";

import { Participant } from "../Participant/Participant";
import { ParticipantContext } from "../Participant/ParticipantContext";

export class ParticipantPanel extends React.Component {
    props: IParticipantPanelProps
    state: IParticipantPanelState
    inOtherMenu: boolean
    constructor(props: IParticipantPanelProps) {
        super(props);
        this.props = props;

        this.state = {
            participants: this.props.participants
        }
        this.inOtherMenu = false;
    }

    componentDidMount() {
        document.addEventListener("click", () => {
            if (!this.state.contextMenu || this.inOtherMenu) return;
            this.setState({contextMenu: undefined});
        })
        this.props.ws.on<any>(EVENT_CODES.PARTICIPANT_UPDATE, (data: IParticipantUpdateEventData) => {
            this.setState((state: IParticipantPanelState) => {
                const participant = state.participants.find(p => data.id === p.id);
                if (!participant) return;
                Object.assign(participant, data);
                return state;
            });
        });
    }

    onParticipantContextMenu(data: IParticipantCustomContextMenuData) {
        if (!data || !data.participant) return;
        this.setState({contextMenu: data});
    }

    render() {
        return (
            <Col sm="3">
                {this.state.contextMenu && (
                    <ParticipantContext
                      thisParticipant={this.props.thisParticipant}
                      contextMenu={this.state.contextMenu}
                      onGeneralFocus={() => {
                          this.inOtherMenu = true
                      }}
                      onBlurColor={(color) => {
                          this.inOtherMenu = false;
                          console.log(`New color: ${color}`);
                      }}
                      onBlurName={(name) => {
                          this.inOtherMenu = false;
                          console.log(`New name: ${name}`);
                      }}
                      onClickBan={() => {
                          console.log("Ban was clicked!");
                      }}
                      onClickKick={() => {
                          console.log("Kick was clicked!");
                      }}
                      onClickMute={() => {
                          console.log("Mute was clicked!");
                      }}> 
                    </ParticipantContext>
                )}
                <div className="room-ParticipantList">
                    <ListGroup>
                        {this.props.participants.map(p => <Participant participant={p} thisParticipant={this.props.thisParticipant} onContextMenu={this.onParticipantContextMenu.bind(this)}></Participant>)}
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
    participants: Array<ParticipantData>,
    contextMenu?: IParticipantCustomContextMenuData
}

export interface IParticipantUpdateEventData {
    id: string,
    banned?: boolean,
    color?: boolean,
    admin?: boolean,
    online?: boolean,
    muted?: boolean
}

export interface IParticipantCustomContextMenuData {
    participant: ParticipantData,
    x: number,
    y: number
}
