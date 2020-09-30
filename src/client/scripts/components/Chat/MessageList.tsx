
import React from "react";
import { MessageData, RoomData } from "../../pages/Room";
import { Message } from "./Message";


export class MessageList extends React.Component {
    props: IMessageListProps
    listRef: React.RefObject<HTMLDivElement>
    constructor(props: IMessageListProps) {
        super(props);
        this.props = props;
        this.listRef = React.createRef();
    }

    componentDidUpdate() {
        this.listRef.current?.scroll(0, 0);
        if (!this.listRef.current) return;
        this.listRef.current.scrollTop = this.listRef.current.scrollHeight;
    }


    render() {
        return(
            <div ref={this.listRef} className="room-messageList" onScroll={(e) => {
                if (!e.target) return;
                const target  = e.target as HTMLDivElement;
                if (target.scrollTop === 0) {
                    this.props.onScrollTop();
                }
            }}>
                {this.props.messages.map(m => <Message author={this.props.room.participants.find(p => p.id === m.authorId)} raw={m}></Message>)}
            </div>
        );
    }
}


export interface IMessageListProps {
    messages: Array<MessageData>,
    room: RoomData,
    onScrollTop: () => void
}