
import React from "react";
import { ISuggestion, SuggestionBox } from "./SuggestionBox";
import { ChatBox } from "./ChatBox";
import { ParticipantData, RoomData } from "../../../pages/Room";

import { post } from "../../../util/fetch";
import { Handler, ALL_COMMANDS } from "../../../util/commandHandler";
import { WebSocketClient } from "../../../websocket/WebSocketClient";

export class ChatBoxArea extends React.Component<IChatBoxAreaProps, IChatBoxAreaState> {
    messageBoxRef: React.RefObject<ChatBox>
    constructor(props: IChatBoxAreaProps) {
        super(props);
        this.state = {
            suggestions: []
        };
        this.messageBoxRef = React.createRef();
    }

    render() {
        return (
            <React.Fragment>

                <SuggestionBox suggestions={this.state.suggestions} onSuggestionClick={(suggestion) => {
                    this.messageBoxRef.current?.addToValue(suggestion.name + " ");
                    /** The suggestions gets cleared a little bit later, because if the user uses the enter key to select the suggestion, then it gets automatically sent */
                    setTimeout(() => this.setState({suggestions: []}), 50);
                }}></SuggestionBox>

                <ChatBox ref={this.messageBoxRef} isChatLocked={this.props.room.chatLocked && !this.props.thisParticipant.admin} onSend={async (content: string, setValue: (value: string) => void) => {
                    if (this.state.suggestions.length) return;
                    content = content.replace(/\s+/g, " ").trim();
                    if (!content.length) return;
                    if (content.length > 2048) return alert("Message too long!");
                    if (content.startsWith("/")) {
                        await Handler(content, "/", this.props.ws, this.props.room, this.props.thisParticipant);
                        return setValue("");
                    }
                    const res = await post<undefined>(`/room/${this.props.room.id}/messages`, { content });
                    if (res && "error" in res) return alert(res.error);
                    setValue("");
                }} 


                onChange={(value: string) => {
                    if (value.startsWith("/")) {
                        if (value === "/") this.setState({suggestions: ALL_COMMANDS.map(c => ({ name: c }))});
                        else this.setState({ suggestions: ALL_COMMANDS.filter(c => calculateStringDifference(value, c) <= 4).map(c => ({ name: c })) });
                    } else if (value.endsWith("@")) this.setState({suggestions: this.props.room.participants.map(p => ({name: p.name}))});
                    /** Check if the last word in the sentance starts with @ */
                    else if (/@(.([^\s]+)*)$/.test(value)) {
                        const matchData = value.match(/@(.([^\s]+)*)$/);
                        if (!matchData) return;
                        const match = matchData[1];
                        if (!match) return;
                        return this.setState({suggestions: this.props.room.participants.filter(p => calculateStringDifference(match, p.name) <= 5).map(p => ({name: p.name}))});
                    } else this.setState({ suggestions: [] });
                }}></ChatBox>
            </React.Fragment>
        );
    }
}

function calculateStringDifference(str1: string, str2: string) : number {
    /** Levenstein algorithm */
    const matrix: Array<Array<number>> = Array.from({length: str2.length + 1}, () => Array.from({length: str1.length + 1}));
    for (let i=0; i <= str1.length; i++) {
        matrix[0][i] = i;
    }
    for (let i=0; i <= str2.length; i++) {
        matrix[i][0] = i;
    }
    for (let j=1; j <= str2.length; j++) {
        for (let i=1; i <= str1.length; i++) {
            const indicator = str1[i - 1] === str2[j - 1] ? 0:1;
            matrix[j][i] = Math.min(matrix[j][i-1] + 1, matrix[j-1][i] + 1, matrix[j-1][i-1] + indicator);
        }
    }
    return matrix[str2.length][str1.length];
}

export interface IChatBoxAreaProps {
    room: RoomData,
    ws: WebSocketClient,
    thisParticipant: ParticipantData
}

export interface IChatBoxAreaState {
    suggestions: Array<ISuggestion>
}