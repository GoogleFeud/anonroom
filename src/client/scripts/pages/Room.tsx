
import {Container, Row, Col, ListGroup, ListGroupItem, Badge, Spinner} from "react-bootstrap";
import React from "react";
import {WebSocketClient} from "../websocket/WebSocketClient";
import {get} from "../util/fetch";
import {handleSocketState, EVENT_CODES} from "../websocket/handleSocketState";

import {SettingsButton} from "../components/SettingsButton";

export class Room extends React.Component {
    state: RoomState
    ws?: WebSocketClient
    props: RoomProps
    thisParticipant?: ParticipantData
    constructor(props: RoomProps) {
        super(props);
        this.props = props;
        this.state = {
            roomData: undefined
        }
    }

    async componentDidMount() {
        const roomData = await get<RoomDetailsRes>(`/room/${this.props.roomId}/details`);
        if ("error" in roomData) return;
        const room = roomData.room;
        this.thisParticipant = room.participants.find(p => p.id === roomData.requesterId);
        if (!this.thisParticipant) return;
        this.ws = new WebSocketClient(`ws://localhost:4000/gateway?roomId=${room.id}&participantId=${this.thisParticipant.id}`);
        this.ws.on("open", () => {
            this.setState({roomData: room});
            handleSocketState(this.ws as WebSocketClient);

            this.ws?.on<any>(EVENT_CODES.PARTICIPANT_UPDATE, console.log);
        });
    }

    render() {
        if (!this.state.roomData || !this.ws) return(
        <Spinner animation="border" role="status">
         <span className="sr-only">Loading...</span>
        </Spinner>
        )
        return(
            <Container fluid>
                <Row>
                    <Col sm="3">
                 <div className="room-ParticipantList"> 
                      <ListGroup>
                      <ListGroupItem>
                          GoogleFeud
                      <Badge style={{color: "red"}}>admin</Badge>
                      </ListGroupItem>
                      <ListGroupItem>name</ListGroupItem>
                      <ListGroupItem>name</ListGroupItem>
                      <ListGroupItem>name</ListGroupItem>
                      <ListGroupItem>name</ListGroupItem>
                      <ListGroupItem>name</ListGroupItem>
                      <ListGroupItem>name</ListGroupItem>
                      <ListGroupItem>name</ListGroupItem>
                      <ListGroupItem>name</ListGroupItem>
                      <ListGroupItem>name</ListGroupItem>
                  </ListGroup>
                  </div> 
                  </Col>
                  <Col sm="3">
                  <div>
                    <div className="room-messageList">
                        <p>This is a long-ass chat message that you will have to scroll to see or I dunno this message is fummary!!</p>
                        <p>This is a chat message!</p>
                        <p>This is a chat message!</p>
                        <p>This is a chat message!</p>
                        <p>This is a chat message!</p>
                        <p>This is a chat message!</p>
                    </div>
                    <input type="text" className="room-chatbox"></input>
                    </div>
                    </Col>
                    {
                        this.thisParticipant && this.thisParticipant.admin && (
                            <Col sm="2">
                            <SettingsButton></SettingsButton>
                         </Col>
                        )
                    }
                </Row>
            </Container>
        )
    }
    
}

export interface ParticipantData {
    id: string,
    muted: boolean,
    banned: boolean,
    admin: boolean,
    color?: string
}

export interface MessageData {
    authorName?: string,
    content: string,
    sentAt: number
}

export interface RoomData {
   id: string,
   participants: Array<ParticipantData>,
   messages: Array<MessageData>,
   chatLocked: boolean,
   roomLocked: boolean,
   maxParticipants?: number,
   discordWebhook?: string,
   messagesPage: number,
}

export interface RoomDetailsRes {
    room: RoomData,
    requesterId: string
}


interface RoomState {
    roomData?: RoomData,
}

interface RoomProps {
    roomId: string
}