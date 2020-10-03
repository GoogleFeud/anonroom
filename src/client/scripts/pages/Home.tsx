
import React, { ChangeEvent } from "react";
import {Container, Row, Col} from "react-bootstrap";
import {post} from "../util/fetch";


export default class Home extends React.Component {
    state: IHomeState
    created?: string
    constructor(props: Readonly<unknown>) {
        super(props);
        this.state = {
            adminPassword: "",
            maxParticipants: 0,
            error: "",
            message: "",
            discordWebhook: "",
            lockChat: false
        };
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

    handleDiscordWebhook(event: ChangeEvent<HTMLInputElement>) {
        if (!event.target) return;
        const value = event.target.value;
        if (!/discordapp.com\/api\/webhooks\/([^/]+)\/([^/]+)/.test(value)) return this.setState({error: "Invalid discord webhook URL!"});
        this.setState({discordWebhook: value, error: ""});
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
                        <div className="form-field">
                            <span className="form-field-title">Admin Password*: </span> 
                            <input type="text" value={this.state.adminPassword} onChange={this.handleAdminPasswordChange.bind(this)}></input>
                        </div>
                        <div className="form-field">
                            <span className="form-field-title">Max Participants: </span> 
                            <input type="number" value={this.state.maxParticipants} onChange={this.handleMaxParticipantsChange.bind(this)}></input>
                        </div>
                        <div className="form-field">
                            <span className="form-field-title" >Discord webhook link:</span> 
                            <input type="text" value={this.state.discordWebhook} onChange={this.handleDiscordWebhook.bind(this)}></input>
                        </div>
                        <div className="form-field" style={{marginBottom: "15px"}}>
                            <span className="form-field-title">Lock chat?:</span> 
                            <input type="checkbox" checked={this.state.lockChat} onChange={this.handleLockChat.bind(this)}></input>
                        </div>
                        <button className="joinBtn" onClick={async () => {
                            if (this.created) return this.setState({error: this.created});
                            if (!this.state.adminPassword.length) return this.setState({error: "You must provide an admin password!"});
                            if (this.state.adminPassword.length < 6) return this.setState({error: "Password must be at least 6 characters long!"});
                            const res = await post<ICreateRoomResponse>("/room", 
                                {
                                    adminPassword: this.state.adminPassword, 
                                    maxParticipants: this.state.maxParticipants,
                                    discordWebhook: this.state.discordWebhook,
                                    lockChat: this.state.lockChat
                                });
                            if (!res) return this.setState({error: "Something went wrong!"});
                            if ("error" in res) return this.setState({error: res.error});
                            this.created = res.link;
                            this.setState({message: res.link});
                        }}>Create</button>
                        <p style={{color: "red", fontWeight: "bold"}}>{this.state.error}</p>
                        <p style={{fontWeight: "bold"}}>{this.state.message}</p>
                    </Col>
                </Row>
            </Container>
        );
    }
}

interface ICreateRoomResponse {
    link: string
}

interface IHomeState {
    adminPassword: string,
    maxParticipants: number,
    error: string,
    message: string,
    discordWebhook: string,
    lockChat: boolean,
   }