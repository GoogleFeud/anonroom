
import {Container, Row, Col, ListGroup, ListGroupItem, Badge} from "react-bootstrap";
import React from "react";



export default class Room extends React.Component {
    constructor(props: Readonly<{}>) {
        super(props);
    }

    render() {
        return(
            <Container>
                <Row>
                 <div className="room-ParticipantList"> 
                      <ListGroup>
                      <ListGroupItem>
                          GoogleFeud
                      <Badge style={{color: "red"}}>admin</Badge>
                      </ListGroupItem>
                      <ListGroupItem>Something else</ListGroupItem>
                      <ListGroupItem>Hidden</ListGroupItem>
                      <ListGroupItem>GoogleFeud</ListGroupItem>
                      <ListGroupItem>Something else</ListGroupItem>
                  </ListGroup>
                  </div> 
                </Row>
            </Container>
        )
    }
    
}