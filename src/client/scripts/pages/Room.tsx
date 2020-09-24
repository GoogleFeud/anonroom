
import {Container, Row, Col, ListGroup, ListGroupItem, Badge} from "react-bootstrap";
import React from "react";



export default class Room extends React.Component {
    constructor(props: Readonly<{}>) {
        super(props);
    }

    render() {
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
                  <Col sm="4">
                  <div>
                    <div className="room-messageList">
                        <p>This is a long-ass chat message that you will have to scroll to see or I dunno this message is fummary!!</p>
                        <p>This is a chat message!</p>
                        <p>This is a chat message!</p>
                        <p>This is a chat message!</p>
                        <p>This is a chat message!</p>
                        <p>This is a chat message!</p>
                        <p>This is a chat message!</p>
                        <p>This is a chat message!</p>
                        <p>This is a chat message!</p>
                        <p>This is a chat message!</p>
                        <p>This is a chat message!</p>
                        <p>This is a chat message!</p>
                        <p>This is a chat message!</p>
                        <p>This is a chat message!</p>
                        <p>This is a chat message!</p>
                        <p>This is a chat message!</p>
                        <p>This is a chat message!</p>
                        <p>This is a chat message!</p>
                        <p>This is a chat message!</p>
                        <p>This is a chat message!</p>
                        <p>This is a chat message!</p>
                        <p>This is a chat message!</p>
                        <p>This is a chat message!</p>
                        <p>This is a chat message!</p>
                        <p>This is a chat message!</p>
                        <p>This is a chat message!</p>
                        <p>This is a chat message!</p>
                        <p>This is a chat message!</p>
                        <p>This is a chat message!</p>
                        <p>This is a chat message!</p>
                        <p>This is a chat message!</p>
                        <p>This is a chat message!</p>
                        <p>This is a chat message!</p>
                        <p>This is a chat message!</p>
                        <p>This is a chat message!</p>
                        <p>This is a chat message!</p>
                        <p>This is a chat message!</p>
                        <p>This is a long-ass chat message that you will have to scroll to see or I dunno this message is fummary!</p>
                        <p>This is a chat message!</p>
                        <p>This is a chat message!</p>
                    </div>
                    <input type="text" className="room-chatbox"></input>
                    </div>
                    </Col>
                    <Col sm="3">
                        <button>Lock Chat</button>
                        <button>Lock Room</button>
                        <div className="formField">
                        <span>Max participants:</span> <input type="number"></input>
                       </div>
                    </Col>
                </Row>
            </Container>
        )
    }
    
}