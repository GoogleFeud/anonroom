import React from "react";
import { ListGroup, ListGroupItem } from "react-bootstrap";
import { IParticipantCustomContextMenuData } from "../Panels/ParticipantPanel";

import { ParticipantData } from "../../pages/Room";

export function ParticipantContext(props: IParticipantContextProps) {
    if (props.thisParticipant.id === props.contextMenu.participant.id) {
        return (
            <div style={{ position: "relative", width: 0, height: 0 }}>
            <ListGroup className="dropdown" style={{ left: props.contextMenu.x, top: props.contextMenu.y }}>
                <ListGroupItem>
                    <span>Name:</span>
                    <input type="text" defaultValue={props.contextMenu.participant.name}
                        onFocus={props.onGeneralFocus}
                        onBlur={(e) => {
                            props.onBlurName(e.target.value);
                        }}
                    ></input>
                </ListGroupItem>
                <ListGroupItem>
            <span>Color:</span>
            <input type="color" defaultValue={props.contextMenu.participant.color}
                onFocus={props.onGeneralFocus}
                onBlur={(e) => {
                    props.onBlurColor(e.target.value);
                }}
            ></input>
        </ListGroupItem>
            </ListGroup>
            </div>
        )
    }
    else if (props.contextMenu.participant.admin) return <div></div>
        return(
        <div style={{ position: "relative", width: 0, height: 0 }}>
            <ListGroup className="dropdown" style={{ left: props.contextMenu.x, top: props.contextMenu.y }}>
            <ListGroupItem onClick={props.onClickMute}>Mute</ListGroupItem>
            <ListGroupItem onClick={props.onClickKick}>Kick</ListGroupItem>
           <ListGroupItem onClick={props.onClickBan}>Ban</ListGroupItem>
                <ListGroupItem>
                    <span>Name:</span>
                    <input type="text" defaultValue={props.contextMenu.participant.name}
                        onFocus={props.onGeneralFocus}
                        onBlur={(e) => {
                            props.onBlurName(e.target.value);
                        }}
                    ></input>
                </ListGroupItem>
                <ListGroupItem>
            <span>Color:</span>
            <input type="color" defaultValue={props.contextMenu.participant.color}
                onFocus={props.onGeneralFocus}
                onBlur={(e) => {
                    props.onBlurColor(e.target.value);
                }}
            ></input>
        </ListGroupItem>
        </ListGroup>
        </div>
        )
}

export interface IParticipantContextProps {
    contextMenu: IParticipantCustomContextMenuData,
    thisParticipant: ParticipantData,
    onGeneralFocus: () => void,
    onBlurColor: (value: string) => void,
    onBlurName: (value: string) => void,
    onClickMute: () => void,
    onClickKick: () => void,
    onClickBan: () => void,
    children: never[]
}