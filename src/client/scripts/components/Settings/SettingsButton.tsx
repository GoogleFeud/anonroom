
import React from "react";
import { RoomData } from "../../pages/Room";
import {Settings} from "./Settings";

import {post, del} from "../../util/fetch";
import {sendClientMessage} from "../../util/util";
import { WebSocketClient } from "../../websocket/WebSocketClient";

export class SettingsButton extends React.Component {
    state: ISettingsButtonState
    props: ISettingsButtonProps
    constructor(props: ISettingsButtonProps) {
        super(props);
        this.props = props;
        this.state = {
            open: false
        };
    }

    render() {
        return(
            <div className="room-controls">
                <button className="room-controls-access-btn" onClick={() => {
                    this.setState((state: ISettingsButtonState) => {
                        this.setState({open: !state.open});
                    });
                }}>Settings</button>
                {
                    this.state.open && (
                        <Settings room={this.props.room} 
                            onLockChatClick={async () => {
                                const res = await post<undefined>(`/room/${this.props.room.id}`, {chatLocked: !this.props.room.chatLocked});
                                if (res && "error" in res) sendClientMessage(this.props.ws, res.error);
                            }}
                            onLockRoomClick={async () => {
                                const res = await post<undefined>(`/room/${this.props.room.id}`, {roomLocked: !this.props.room.roomLocked});
                                if (res && "error" in res) sendClientMessage(this.props.ws, res.error);
                            }}
                            onRoomDeleteClick={async () => {
                                const res = await del(`/room/${this.props.room.id}`);
                                if (res && "error" in res) sendClientMessage(this.props.ws, res.error);
                            }}
                            onMaxParticipantsChange={async (value, e) => {
                                if (value < 0) return sendClientMessage(this.props.ws, "Max participants must be a positive number, or 0 for unlimited participants.");
                                const res = await post<undefined>(`/room/${this.props.room.id}`, {maxParticipants: value});
                                if (res && "error" in res) {
                                    sendClientMessage(this.props.ws, res.error);
                                    e.value = this.props.room.maxParticipants?.toString() || "";
                                }
                            }}
                            onDiscordWebhookChange={async (value, e) => {
                                // eslint-disable-next-line no-useless-escape
                                if (value && /discord.com\/api\/webhooks\/([^\/]+)\/([^\/]+)/.test(value) === false) return sendClientMessage(this.props.ws, "Invalid discord webhook URL!");
                                const res = await post<undefined>(`/room/${this.props.room.id}`, {discordWebhook: value});
                                if (res && "error" in res) {
                                    sendClientMessage(this.props.ws, res.error);
                                    e.value = this.props.room.discordWebhook || "";
                                }
                            }}
                        ></Settings>
                    )
                }
            </div>
        );
    }
}

export interface ISettingsButtonState {
     open: boolean,
 }

export interface ISettingsButtonProps {
    room: RoomData,
    ws: WebSocketClient
}