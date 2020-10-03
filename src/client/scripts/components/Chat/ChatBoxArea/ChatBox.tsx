import React from "react";


export class ChatBox extends React.Component<IChatBoxProps, IChatBoxState> {
    state: IChatBoxState
    constructor(props: IChatBoxProps) {
        super(props);
        this.state = {
            value: ""
        };
    }

    setValue(value: string) : void {
        this.setState({value});
    }

    addToValue(value: string) : void {
        this.setState(state => ({value: state.value + value}));
    }

    render() {
        return (
            <input type="text" className="room-chatbox" disabled={this.props.isChatLocked} value={this.state.value} onKeyPress={e => {
                if (e.key === "Enter") {
                    if (!e.target) return;
                    const input = e.target as HTMLInputElement;
                    this.props.onSend(input.value, this.setValue.bind(this));
                }
            }} onChange={e => {
                if (!e.target) return;
                this.props.onChange(e.target.value, e.target);
                this.setState({value: e.target.value});
            }}></input>
        );
    }

}

export interface IChatBoxProps {
    isChatLocked: boolean,
    onSend: (content: string, setValue: (value: string) => void) => void,
    onChange: (val: string, input: HTMLInputElement) => void
    value?: string
}

export interface IChatBoxState {
    value: string
}