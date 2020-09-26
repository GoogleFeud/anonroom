import React, { ChangeEvent } from "react";
import {RouteComponentProps} from "react-router";
import {Container, Row, Col, Spinner} from "react-bootstrap";
import {get, post} from "../util/fetch";

import {Room} from "./Room";

export default class JoinRoom extends React.Component {
    state: IJoinRoomState
    props: RouteComponentProps
    constructor(props: RouteComponentProps) {
        super(props);
        this.props = props;
        this.state = {
            username: "",
            color: "",
            error: "",
            forceIn: false
        }
    }
    
    async componentDidMount() {
        const roomId = (this.props.match.params as IJoinRoomParams).roomId;
        const room = await get<IGetRoomRes>(`/room/${roomId}/check`);
        if ("error" in room || room.id !== roomId) return this.setState({data: false});
        this.setState({data: room});
    }

    handleUsernameChange(event: ChangeEvent<HTMLInputElement>) {
        if (!event.target) return;
        const value = event.target.value;
        if (value.length > 12) return this.setState({error: "Username cannot exceed 12 characters!"});
        this.setState({username: value, error: ""});
    }

    handleColorChange(event: ChangeEvent<HTMLInputElement>) {
        if (!event.target) return;
        this.setState({color: event.target.value, error: ""});
    }

    render() {
        if (this.state.data == undefined  && !this.state.forceIn) return(
            <Spinner animation="border" role="status">
                 <span className="sr-only">Loading...</span>
            </Spinner>
        )
        else if ((this.state.data === false || this.state.data === true) && !this.state.forceIn) {
            return(
            <div className="center align-self-center">
            <h1>Room doesn't exist.</h1>
            </div>
        )
            }
        else if (typeof this.state.data === "object" && !this.state.data.in && !this.state.forceIn) {
            return(
                <Container>
                    <Row  style={{height: "100vh"}}>
                        <Col className="center align-self-center">
                            <div className="formField">
                            <h1>Enter name:</h1>
                            <input type="text" value={this.state.username} onChange={this.handleUsernameChange.bind(this)}></input>
                            </div>
                            <div className="formField">
                            <h1>Color:</h1>
                            <input type="color" value={this.state.color} onChange={this.handleColorChange.bind(this)}></input>
                            </div>
                            <button className="joinBtn" onClick={async () => {
                                const res = await post<undefined>(`/room/${(this.props.match.params as IJoinRoomParams).roomId}/join`, {name: this.state.username, color: this.state.color});
                                if (res && "error" in res) return this.setState({error: res.error});
                                this.setState({forceIn: true});
                            }}>Create</button>
                            <p style={{color: "red", fontWeight: "bold"}}>{this.state.error}</p>
                        </Col>
                    </Row>
                </Container>
            )
        } else {
            return <Room roomId={(this.props.match.params as IJoinRoomParams).roomId}></Room>
        }
    }
}


interface IJoinRoomParams {
    roomId: string
}

interface IJoinRoomState {
    username: string,
    error: string,
    data?: IGetRoomRes|boolean,
    forceIn: boolean,
    color: string
}

interface IGetRoomRes {
    id: string,
    in: boolean
}