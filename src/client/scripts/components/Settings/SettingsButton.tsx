
import React from "react";

export class SettingsButton extends React.Component {
    state: SettingsButtonState
    constructor(props: Readonly<{}>) {
        super(props);
        this.state = {
            open: false
        }
    }

    render() {
        return(
            <div className="room-controls">
                <button onClick={() => {
                    this.setState((state: SettingsButtonState) => {
                        this.setState({open: !state.open});
                    });
                }}>Settings</button>
               {
               this.state.open && (<div className="room-controls-modal">
                        <button className="room-controls-button">Lock Chat</button>
                        <button className="room-controls-button">Lock Room</button>
                        <div className="formField">
                        <span>Max participants:</span> <input type="number" className="room-controls-input"></input>
                       </div>
                       <div className="formField">
                        <span>Discord webhook link:</span> <input type="text" className="room-controls-input"></input>
                       </div> 
                       </div>)
                }
            </div>
        )
    }
}

interface SettingsButtonState {
     open: boolean
}