

import React, { Component} from 'react';
import { Route, Switch, Link } from 'react-router-dom';

import Home from "./pages/Home";
import JoinRoom from "./pages/JoinRoom";

function Error() {
    return <p>Error!</p>
}

export default class App extends Component {
    constructor(props: Readonly<{}>) {
        super(props);
    }

    render() {
        return (
        <div>
            <Switch>
                <Route path="/" component={Home} exact />
                <Route path="/room/:roomId/" component={JoinRoom} exact />
                <Route component={Error} />
            </Switch>
        </div>)
    }
}