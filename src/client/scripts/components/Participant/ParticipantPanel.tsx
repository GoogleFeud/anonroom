import React from "react";
import {Col, ListGroup} from "react-bootstrap";
import { ParticipantData } from "../../pages/Room";
import { WebSocketClient } from "../../websocket/WebSocketClient";
import { EVENT_CODES } from "../../websocket/handleSocketState";

import { Participant } from "./Participant";
import { ParticipantContext } from "./ParticipantContext";

import {post} from "../../util/fetch";
import {sendClientMessage} from "../../util/util";

export class ParticipantPanel extends React.Component {
    props: IParticipantPanelProps
    state: IParticipantPanelState
    inOtherMenu: boolean
    constructor(props: IParticipantPanelProps) {
        super(props);
        this.props = props;

        this.state = {
            participants: this.props.participants
        };
        this.inOtherMenu = false;
    }

    componentDidMount() {
        document.addEventListener("click", () => {
            if (!this.state.contextMenu || this.inOtherMenu) return;
            this.setState({contextMenu: undefined});
        });
        this.props.ws.on<any>(EVENT_CODES.PARTICIPANT_UPDATE, (data: IParticipantUpdateEventData) => {
            this.setState((state: IParticipantPanelState) => {
                const participant = state.participants.find(p => data.id === p.id);
                if (!participant) return;
                Object.assign(participant, data);
                return state;
            });
        });

        this.props.ws.on<any>(EVENT_CODES.PARTICIPANT_JOIN, (data: ParticipantData) => {
            this.setState((state: IParticipantPanelState) => {
                state.participants.push(data);
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
                            this.inOtherMenu = true;
                        }}
                        onBlurColor={async (color) => {
                            if (!this.state.contextMenu) return;
                            this.inOtherMenu = false;
                            if (color === this.state.contextMenu.participant.color) return;
                            const res = await post<undefined>(`/room/${this.props.roomId}/participants/${this.state.contextMenu.participant.id}`, {color});
                            if (res && "error" in res) return sendClientMessage(this.props.ws, res.error);
                        }}
                        onBlurName={async (name) => {
                            if (!this.state.contextMenu) return;
                            this.inOtherMenu = false;
                            if (name === this.state.contextMenu.participant.name) return;
                            const res = await post<undefined>(`/room/${this.props.roomId}/participants/${this.state.contextMenu.participant.id}`, {name});
                            if (res && "error" in res) return sendClientMessage(this.props.ws, res.error);
                        }}
                        onClickBan={async () => {
                            if (!this.state.contextMenu) return;
                            const res = await post<undefined>(`/room/${this.props.roomId}/participants/${this.state.contextMenu.participant.id}`, {banned: !this.state.contextMenu.participant.banned});
                            if (res && "error" in res) return sendClientMessage(this.props.ws, res.error);
                        }}
                        onClickKick={async () => {
                            if (!this.state.contextMenu) return;
                            const res = await post<undefined>(`/room/${this.props.roomId}/participants/${this.state.contextMenu.participant.id}/kick`, {});
                            if (res && "error" in res) return sendClientMessage(this.props.ws, res.error);
                        }}
                        onClickMute={async () => {
                            if (!this.state.contextMenu) return;
                            const res = await post<undefined>(`/room/${this.props.roomId}/participants/${this.state.contextMenu.participant.id}`, {muted: !this.state.contextMenu.participant.muted});
                            if (res && "error" in res) return sendClientMessage(this.props.ws, res.error);
                        }}> 
                    </ParticipantContext>
                )}
                <div className="room-ParticipantList">
                    <ListGroup>
                        {this.props.participants.map(p => <Participant participant={p} thisParticipant={this.props.thisParticipant} onContextMenu={this.onParticipantContextMenu.bind(this)}></Participant>)}
                    </ListGroup>
                </div>
            </Col>
        );
    }
}


export interface IParticipantPanelProps {
    ws: WebSocketClient
    participants: Array<ParticipantData>
    thisParticipant: ParticipantData
    roomId: string,
    history: any
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
    muted?: boolean,
    kicked?: boolean
}

export interface IParticipantCustomContextMenuData {
    participant: ParticipantData,
    x: number,
    y: number
}

