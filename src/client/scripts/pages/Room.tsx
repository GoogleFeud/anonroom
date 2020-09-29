
import { Container, Row, Col, Spinner } from "react-bootstrap";
import React from "react";
import { WebSocketClient } from "../websocket/WebSocketClient";
import { get } from "../util/fetch";
import { handleSocketState, EVENT_CODES } from "../websocket/handleSocketState";

import { SettingsButton } from "../components/Settings/SettingsButton";
import { ParticipantPanel } from "../components/Participant/ParticipantPanel";
import { ChatPanel } from "../components/Chat/ChatPanel";


export class Room extends React.Component {
    state: IRoomState
    ws?: WebSocketClient
    props: IRoomProps
    thisParticipant?: ParticipantData
    constructor(props: IRoomProps) {
        super(props);
        this.props = props;
        this.state = {
            roomData: undefined
        }
    }

    async componentDidMount() {
        const roomData = await get<IRoomDetailsRes>(`/room/${this.props.roomId}/details`);
        if ("error" in roomData) return;
        const room = roomData.room;
        room.messages = room.messages.reverse();
        this.thisParticipant = room.participants.find(p => p.id === roomData.requesterId);
        if (!this.thisParticipant) return;
        this.thisParticipant.online = true;
        this.ws = new WebSocketClient(`ws://localhost:4000/gateway?roomId=${room.id}&participantId=${this.thisParticipant.id}`, this.props.history);
        this.ws.on("open", () => {
            if (!this.ws) return;
            this.setState({ roomData: room });
            handleSocketState(this.ws as WebSocketClient);

            this.ws.on<any>(EVENT_CODES.ROOM_UPDATE, (data) => {
                this.setState((state: IRoomState) => {
                    if (!state.roomData) return;
                    Object.assign(state.roomData, data);
                    return state;
                })
            });

            this.ws.on<any>(EVENT_CODES.ROOM_CLOSE, () => {
                this.props.history.push("/");
            });
        });
    }

    render() {
        if (!this.state.roomData || !this.ws || !this.thisParticipant) return (
            <Spinner animation="border" role="status">
                <span className="sr-only">Loading...</span>
            </Spinner>
        )
        return (
            <Container fluid>
                <Row>
                    <ParticipantPanel history={this.props.history} roomId={this.state.roomData.id} ws={this.ws} participants={this.state.roomData.participants} thisParticipant={this.thisParticipant}></ParticipantPanel>

                    <ChatPanel thisParticipant={this.thisParticipant} room={this.state.roomData} ws={this.ws}></ChatPanel>
                    {
                        this.thisParticipant && this.thisParticipant.admin && (
                            <Col sm="2">
                                <SettingsButton room={this.state.roomData}></SettingsButton>
                            </Col>
                        )
                    }
                </Row>
            </Container>
        )
    }

}

export interface ParticipantData {
    name: string,
    id: string,
    muted: boolean,
    banned: boolean,
    admin: boolean,
    color?: string,
    online: boolean
}

export interface MessageData {
    authorId?: string,
    content: string,
    sentAt: number,
    roomId: string
}

export interface RoomData {
    id: string,
    participants: Array<ParticipantData>,
    messages: Array<MessageData>,
    chatLocked: boolean,
    roomLocked: boolean,
    maxParticipants?: number,
    discordWebhook?: string,
    page: number,
}

export interface IRoomDetailsRes {
    room: RoomData,
    requesterId: string
}

interface IRoomState {
    roomData?: RoomData,
}

interface IRoomProps {
    roomId: string,
    history: any
}