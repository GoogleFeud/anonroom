
import React, { ChangeEvent } from "react";
import {Container, Row, Col} from "react-bootstrap";
import {post} from "../util/fetch";

interface IHomeState {
 adminPassword: string,
 maxParticipants: number,
 error: string
}

export default class Home extends React.Component {
    state: IHomeState
    constructor(props: Readonly<{}>) {
        super(props);
        this.state = {
            adminPassword: "",
            maxParticipants: 0,
            error: ""
        }
    }

    handleAdminPasswordChange(event: ChangeEvent<HTMLInputElement>) {
        if (!event.target) return;
        const value = event.target.value;
        if (value.length > 16) return this.setState({error: "Password length cannot exceed 16 characters!"});
        this.setState({adminPassword: value, error: ""});
    }

    handleMaxParticipantsChange(event: ChangeEvent<HTMLInputElement>) {
        if (!event.target) return;
        const value = Number(event.target.value);
        if (value < 0) return this.setState({error: "Max participants must be a positive number, or 0 for unlimited participants."});
        this.setState({maxParticipants: value, error: ""});
    }

    render() {
    return(
        <Container>
            <Row style={{height: "100vh"}}>
                 <Col className="center align-self-center">
                  <h1>Create a room</h1>
                  <p>Create a room link. Give this link to everyone who you want to join the room. Rooms automatically get deleted after 72 hours of no activity.</p>
                  <div className="formField">
                  <span>Admin Password: </span> <input type="text" value={this.state.adminPassword} onChange={this.handleAdminPasswordChange.bind(this)}></input>
                  </div>
                  <div className="formField">
                  <span>Max Participants: </span> <input type="number" value={this.state.maxParticipants} onChange={this.handleMaxParticipantsChange.bind(this)}></input>
                  </div>
                  <button className="joinBtn" onClick={async () => {
                      if (!this.state.adminPassword.length) return this.setState({error: "You must provide an admin password!"});
                      if (this.state.adminPassword.length < 6) return this.setState({error: "Password must be at least 6 characters long!"});
                      const res = await post<ICreateRoomResponse>("/rooms", {adminPassword: this.state.adminPassword, maxParticipants: this.state.maxParticipants});
                      if (res.error) return this.setState({error: res.error});
                      console.log(res);
                  }}>Create</button>
                  <p style={{color: "red", fontWeight: "bold"}}>{this.state.error}</p>
                 </Col>
            </Row>
        </Container>
    )
    }
}

interface ICreateRoomResponse {
    link: string,
    error?: string
}