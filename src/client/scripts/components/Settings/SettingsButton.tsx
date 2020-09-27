
import React from "react";
import { RoomData } from "../../pages/Room";
import {Settings} from "./Settings";

export class SettingsButton extends React.Component {
    state: ISettingsButtonState
    props: ISettingsButtonProps
    constructor(props: ISettingsButtonProps) {
        super(props);
        this.props = props;
        this.state = {
            open: false
        }
    }

    render() {
        return(
            <div className="room-controls">
                <button onClick={() => {
                    this.setState((state: ISettingsButtonState) => {
                        this.setState({open: !state.open});
                    });
                }}>Settings</button>
               {
               this.state.open && (
               <Settings room={this.props.room} 
               onLockChatClick={() => {

               }}
               onLockRoomClick={() => {

               }}
               onMaxParticipantsChange={() => {

               }}
               onDiscordWebhookChange={() => {

               }}
               ></Settings>
               )
                }
            </div>
        )
    }
}

export interface ISettingsButtonState {
     open: boolean
}

export interface ISettingsButtonProps {
    room: RoomData
}