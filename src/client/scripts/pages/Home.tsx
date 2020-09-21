
import React from "react";
import {Container, Row, Col} from "react-bootstrap";


export default function Home() {
    return(
        <Container>
            <Row style={{height: "100vh"}}>
                 <Col className="center align-self-center">
                  <h1>Create a room</h1>
                  <p>Create a room link. Give this link to everyone who you want to join the room. Rooms automatically get deleted after 72 hours of no activity.</p>
                  <span>Admin Password: </span> <input type="text"></input>
                  <button className="joinBtn">Create</button>
                 </Col>
            </Row>
        </Container>
    )
}