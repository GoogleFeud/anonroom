
import {Container, Row, Col, ListGroup, ListGroupItem, Badge, Spinner} from "react-bootstrap";
import React from "react";
import {WebSocketClient} from "../util/WebSocketClient";
import {get} from "../util/fetch";

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

    componentDidMount() {
        this.ws = new WebSocketClient("ws://localhost:4000/gateway");
        this.ws.on("open", async () => {
            const roomData = await get<RoomDetailsRes>(`/room/${this.props.roomId}/details`);
            if ("error" in roomData) return;
            const room = roomData.room;
            this.thisParticipant = room.participants.find(p => p.id === roomData.requesterId);
            this.setState({roomData: room});
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