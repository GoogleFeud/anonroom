
import React from "react";
import { ListGroup, ListGroupItem } from "react-bootstrap";

export class SuggestionBox extends React.Component<ISuggestionBoxProps, ISuggestionBoxState> {
    constructor(props: ISuggestionBoxProps) {
        super(props);
        this.state = {
            currentSuggestionIndex: 0
        };
    }

    componentDidMount() {
        document.body.onkeydown = (e) => {
            if (!this.props.suggestions.length) return;
            if (e.key === "ArrowUp") {
                if (this.state.currentSuggestionIndex === 0) return;
                this.setState(state => {
                    return { currentSuggestionIndex: state.currentSuggestionIndex - 1 };
                });
            } else if (e.key === "ArrowDown") {
                this.setState(state => {
                    if (state.currentSuggestionIndex + 1 >= this.props.suggestions.length) return { currentSuggestionIndex: 0 };
                    return { currentSuggestionIndex: state.currentSuggestionIndex + 1 };
                });
            } else if (e.key === "Enter") {
                const suggestion = this.props.suggestions[this.state.currentSuggestionIndex];
                if (suggestion) this.props.onSuggestionClick(suggestion);
            }
        };
    }

    render() {
        if (!this.props.suggestions.length) return <span></span>;
        return (
            <div>
                <ListGroup className="suggestionBox">
                    {this.props.suggestions.map((s, i) =>
                        <ListGroupItem style={{ backgroundColor: i === this.state.currentSuggestionIndex ? "grey" : "white" }} onClick={() => {
                            this.props.onSuggestionClick(s);
                        }}>{s.name}</ListGroupItem>
                    )}
                </ListGroup>
            </div>
        );
    }
}

export interface ISuggestionBoxProps {
    suggestions: Array<ISuggestion>,
    onSuggestionClick: (suggestion: ISuggestion) => void
}

export interface ISuggestionBoxState {
    currentSuggestionIndex: number
}

export interface ISuggestion {
    name: string,
    description?: string
}