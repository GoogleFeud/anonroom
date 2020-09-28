import React from "react";
import { MessageData, RoomData } from "../../pages/Room";
import { Col } from "react-bootstrap";
import { WebSocketClient } from "../../websocket/WebSocketClient";
import { ChatBox } from "./ChatBox";
import {EVENT_CODES} from "../../websocket/handleSocketState";
import {post} from "../../util/fetch";

import {MessageList} from "./MessageList";

export class ChatPanel extends React.Component {
    props: IChatPanelProps
    state: IChatPanelState
    constructor(props: IChatPanelProps) {
        super(props);
        this.props = props;
        this.state = {
            messages: this.props.room.messages
        }
    }

    componentDidMount() {
        this.props.ws.on<any>(EVENT_CODES.MESSAGE_CREATE, (msg: MessageData) => {
            this.setState((state: IChatPanelState) => {
                state.messages.unshift(msg);
                return state;
            })
        });
    }

    render() {
        return (
            <Col sm="3">
                <div>
                    <MessageList room={this.props.room} messages={this.state.messages}></MessageList>

                    <ChatBox isChatLocked={this.props.room.chatLocked} onSend={async (content: string, input: HTMLInputElement) => {
                        content = content.replace(/\s+/g,' ').trim();
                        if (!content.length) return;
                        if (content.length > 2048) return alert("Message too long!");
                        const res = await post<undefined>(`/room/${this.props.room.id}/messages`, {content});
                        if (res && "error" in res) return alert(res.error);
                        input.value = "";
                    }}></ChatBox>
                </div>
            </Col>
        )
    }
}


export interface IChatPanelProps {
    room: RoomData,
    ws: WebSocketClient
}

export interface IChatPanelState {
    messages: Array<MessageData>
}
