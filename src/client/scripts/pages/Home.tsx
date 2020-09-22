
import React, { ChangeEvent } from "react";
import {Container, Row, Col} from "react-bootstrap";
import {post} from "../util/fetch";

interface IHomeState {
 adminPassword: string,
 maxParticipants: number,
 error: string,
 message: string,
 discordWebhookLink: string,
 lockChat: boolean,
}

export default class Home extends React.Component {
    state: IHomeState
    created?: string
    constructor(props: Readonly<{}>) {
        super(props);
        this.state = {
            adminPassword: "",
            maxParticipants: 0,
            error: "",
            message: "",
            discordWebhookLink: "",
            lockChat: false
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

    handleDiscordWebhookLink(event: ChangeEvent<HTMLInputElement>) {
        if (!event.target) return;
        this.setState({discordWebhookLink: event.target.value, error: ""});
    }

    handleLockChat(event: ChangeEvent<HTMLInputElement>) {
        if (!event.target) return;
        this.setState({lockChat: event.target.checked, error: ""});
    }

    render() {
    return(
        <Container>
            <Row style={{height: "100vh"}}>
                 <Col className="center align-self-center">
                  <h1>Create a room</h1>
                  <p>Create a room link. Give this link to everyone who you want to join the room. Rooms automatically get deleted after 72 hours of no activity. All you need to create a room is an admin password, all other fields are optional.</p>
                  <div className="formField">
                  <span>Admin Password*: </span> <input type="text" value={this.state.adminPassword} onChange={this.handleAdminPasswordChange.bind(this)}></input>
                  </div>
                  <div className="formField">
                  <span>Max Participants: </span> <input type="number" value={this.state.maxParticipants} onChange={this.handleMaxParticipantsChange.bind(this)}></input>
                  </div>
                  <div className="formField">
                      <span>Discord webhook link:</span> <input type="text" value={this.state.discordWebhookLink} onChange={this.handleDiscordWebhookLink.bind(this)}></input>
                  </div>
                  <div className="formField">
                      <span>Lock chat?:</span> <input type="checkbox" checked={this.state.lockChat} onChange={this.handleLockChat.bind(this)}></input>
                  </div>
                  <button className="joinBtn" onClick={async () => {
                      if (this.created) return this.setState({error: this.created});
                      if (!this.state.adminPassword.length) return this.setState({error: "You must provide an admin password!"});
                      if (this.state.adminPassword.length < 6) return this.setState({error: "Password must be at least 6 characters long!"});
                      const res = await post<ICreateRoomResponse>("/rooms", 
                      {
                        adminPassword: this.state.adminPassword, 
                        maxParticipants: this.state.maxParticipants,
                        discordWebhookLink: this.state.discordWebhookLink,
                        lockChat: this.state.lockChat
                    });
                      if ("error" in res) return this.setState({error: res.error});
                      this.created = res.link;
                      this.setState({message: res.link});
                  }}>Create</button>
                  <p style={{color: "red", fontWeight: "bold"}}>{this.state.error}</p>
                  <p style={{fontWeight: "bold"}}>{this.state.message}</p>
                 </Col>
            </Row>
        </Container>
    )
    }
}

interface ICreateRoomResponse {
    link: string
}