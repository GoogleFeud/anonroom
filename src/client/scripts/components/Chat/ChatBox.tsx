import React from "react";



export function ChatBox(props: IChatBoxProps) {
    return(
        <input type="text" className="room-chatbox" disabled={props.isChatLocked} onKeyPress={e => {
            if (e.key === "Enter") {
                if (!e.target) return;
                const input = e.target as HTMLInputElement;
                props.onSend(input.value, input);
            }
        }}></input>
    );
}

export interface IChatBoxProps {
    isChatLocked: boolean,
    onSend: (content: string, input: HTMLInputElement) => void
}