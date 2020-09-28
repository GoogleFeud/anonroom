import React from "react";
import { RoomData } from "../../pages/Room";
import {Col} from "react-bootstrap";


export class ChatPanel extends React.Component {
    props: IChatPanelProps
    constructor(props: IChatPanelProps) {
        super(props);
        this.props = props;
    }

    render() {
        return(
        <Col sm="3">
        <div>
          <div className="room-messageList">
              <p>This is a long-ass chat message that you will have to scroll to see or I dunno this message is fummary!!</p>
          </div>
          
          <input type="text" className="room-chatbox" disabled={this.props.room.chatLocked}></input>
          </div>
          </Col>
        )
    }
}


export interface IChatPanelProps {
    room: RoomData
}