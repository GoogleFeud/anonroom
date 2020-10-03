
import React from "react";
import { ISuggestion, SuggestionBox } from "./SuggestionBox";
import { ChatBox } from "./ChatBox";
import { ParticipantData, RoomData } from "../../../pages/Room";
import {SuggestionManager} from "../../../util/SuggestionManager";

import { post } from "../../../util/fetch";
import { Handler, ALL_COMMANDS } from "../../../util/commandHandler";
import { WebSocketClient } from "../../../websocket/WebSocketClient";

import {calculateStringDifference, sendClientMessage} from "../../../util/util";

export class ChatBoxArea extends React.Component<IChatBoxAreaProps, IChatBoxAreaState> {
    messageBoxRef: React.RefObject<ChatBox>
    suggestionManager: SuggestionManager
    constructor(props: IChatBoxAreaProps) {
        super(props);
        this.state = {
            suggestions: []
        };
        this.messageBoxRef = React.createRef();
        this.suggestionManager = new SuggestionManager((suggestions) => this.setState({suggestions}));
    }

    componentDidMount() {
        this.suggestionManager.add("commands", {
            match: (value) => {
                if (!value.startsWith("/") || /\s/.test(value)) return null;
                if (value === "/") return true;
                // Removes the / from the string
                return value.slice(1);
            },
            getSuggestions: (value: string|true) => {
                if (value === true) return ALL_COMMANDS.map(c => ({ name: c }));
                return ALL_COMMANDS.filter(c => calculateStringDifference(value, c) <= 4).map(c => ({ name: c }));
            }
        });

        this.suggestionManager.add("mentions", {
            match: (value) => {
                if (value.endsWith("@")) return true;
                const matchData = value.match(/@(.([^\s]+)*)$/);
                if (!matchData || !matchData[1]) return;
                return matchData[1];
            },
            getSuggestions: (value: string|true) => {
                if (value === true) return this.props.room.participants.map(p => ({name: p.name}));
                return this.props.room.participants.filter(p => calculateStringDifference(value, p.name) <= 5).map(p => ({name: p.name}));
            }
        });
    }

    render() {
        return (
            <React.Fragment>

                <SuggestionBox suggestions={this.state.suggestions} onSuggestionClick={(suggestion) => {
                    let value = suggestion.name;
                    if (typeof this.suggestionManager.lastMatchedValue === "string") value = value.replace(this.suggestionManager.lastMatchedValue, "");
                    this.messageBoxRef.current?.addToValue(value);
                    /** The suggestions gets cleared a little bit later, because if the user uses the enter key to select the suggestion, then it gets automatically sent */
                    setTimeout(() => this.setState({suggestions: []}), 50);
                }}></SuggestionBox>

                <ChatBox ref={this.messageBoxRef} isChatLocked={this.props.room.chatLocked && !this.props.thisParticipant.admin} onSend={async (content: string, setValue: (value: string) => void) => {
                    if (this.state.suggestions.length) return;
                    content = content.replace(/\s+/g, " ").trim();
                    if (!content.length) return;
                    if (content.length > 2048) return sendClientMessage(this.props.ws, "Message too long!");
                    if (content.startsWith("/")) {
                        await Handler(content, "/", this.props.ws, this.props.room, this.props.thisParticipant);
                        return setValue("");
                    }
                    const res = await post<undefined>(`/room/${this.props.room.id}/messages`, { content });
                    if (res && "error" in res) return sendClientMessage(this.props.ws, res.error);
                    setValue("");
                }} 


                onChange={(value: string) => {
                    const mentionsMatch = this.suggestionManager.test(value);
                    if (!mentionsMatch && this.state.suggestions.length) this.setState({ suggestions: [] });
                }}></ChatBox>
            </React.Fragment>
        );
    }
}


export interface IChatBoxAreaProps {
    room: RoomData,
    ws: WebSocketClient,
    thisParticipant: ParticipantData
}

export interface IChatBoxAreaState {
    suggestions: Array<ISuggestion>
}