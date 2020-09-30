import React from "react";
import { MessageData, ParticipantData, Room, RoomData } from "../../pages/Room";
import { Col } from "react-bootstrap";
import { WebSocketClient } from "../../websocket/WebSocketClient";
import { ChatBox } from "./ChatBox";
import {EVENT_CODES} from "../../websocket/handleSocketState";
import {post, get} from "../../util/fetch";

import {MessageList} from "./MessageList";
import CommandHandler from "../../util/commandHandler";

export class ChatPanel extends React.Component {
    props: IChatPanelProps
    state: IChatPanelState
    lastMessageSentAt?: number
    messageFetchCooldown: boolean
    reachedTheEnd: boolean
    constructor(props: IChatPanelProps) {
        super(props);
        this.props = props;
        this.state = {
            messages: this.props.room.messages
        };
        if (this.props.room.messages.length) this.lastMessageSentAt = this.props.room.messages[0].sentAt;
        this.messageFetchCooldown = false;
        this.reachedTheEnd = false;
    }

    componentDidMount() {
        this.props.ws.on<any>(EVENT_CODES.MESSAGE_CREATE, (msg: MessageData) => {
            this.setState((state: IChatPanelState) => {
                state.messages.push(msg);
                return state;
            });
        });
    }

    render() {
        return (
            <Col sm="3">
                <div>
                    <MessageList room={this.props.room} messages={this.state.messages}
                        onScrollTop={async () => {
                            if (this.messageFetchCooldown || this.reachedTheEnd) return;
                            const messages = await get<Array<MessageData>>(`/room/${this.props.room.id}/messages/page?lastMessageSentAt=${this.lastMessageSentAt}`);
                            if ("error" in messages) return alert(messages.error);
                            if (!messages.length) return this.reachedTheEnd = true;
                            /** For SOME reason, mongoDB returns the results in reverse, so we need to reverse them again to get the right results. Weird. */
                            const reversedMsgs = messages.reverse(); 
                            this.lastMessageSentAt = reversedMsgs[0].sentAt;
                            this.setState((state: IChatPanelState) => {
                                this.state.messages = [...reversedMsgs, ...this.state.messages];
                                this.messageFetchCooldown = true;
                                setTimeout(() => this.messageFetchCooldown = false, 500);
                                return state;
                            });

                        }}></MessageList>
                    <ChatBox isChatLocked={this.props.room.chatLocked && !this.props.thisParticipant.admin} onSend={async (content: string, input: HTMLInputElement) => {
                        content = content.replace(/\s+/g," ").trim();
                        if (!content.length) return;
                        if (content.length > 2048) return alert("Message too long!");
                        if (content.startsWith("/")) {
                            await CommandHandler(content, "/", this.props.ws, this.props.room, this.props.thisParticipant);
                            return input.value = "";
                        }
                        const res = await post<undefined>(`/room/${this.props.room.id}/messages`, {content});
                        if (res && "error" in res) return alert(res.error);
                        input.value = "";
                    }}></ChatBox>
                </div>
            </Col>
        );
    }
}


export interface IChatPanelProps {
    room: RoomData,
    ws: WebSocketClient,
    thisParticipant: ParticipantData
}

export interface IChatPanelState {
    messages: Array<MessageData>
}
