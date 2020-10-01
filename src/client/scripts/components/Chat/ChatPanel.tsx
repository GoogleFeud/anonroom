import React from "react";
import { MessageData, ParticipantData, RoomData } from "../../pages/Room";
import { Col } from "react-bootstrap";
import { WebSocketClient } from "../../websocket/WebSocketClient";
import {EVENT_CODES} from "../../websocket/handleSocketState";
import {get} from "../../util/fetch";

import {MessageList} from "./MessageList";
import MarkdownParser from "../../util/markdown";

import {ChatBoxArea} from "./ChatBoxArea/ChatBoxArea";

export class ChatPanel extends React.Component<IChatPanelProps, IChatPanelState> {
    state: IChatPanelState
    lastMessageSentAt?: number
    messageFetchCooldown: boolean
    reachedTheEnd: boolean
    markdownParser: (str: string) => any
    constructor(props: IChatPanelProps) {
        super(props);
        this.state = {
            messages: this.props.room.messages
        };
        if (this.props.room.messages.length) this.lastMessageSentAt = this.props.room.messages[0].sentAt;
        this.messageFetchCooldown = false;
        this.reachedTheEnd = false;
        this.markdownParser = MarkdownParser(this.props.room);
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
                    <MessageList room={this.props.room} messages={this.state.messages} markdownParser={this.markdownParser}
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
                    <ChatBoxArea {...this.props}></ChatBoxArea>
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
