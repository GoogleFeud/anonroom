

import React, { Component } from "react";
import { Route, Switch } from "react-router-dom";

import Home from "./pages/Home";
import JoinRoom from "./pages/JoinRoom";

function Error() {
    return <p>Error!</p>;
}

import { importCSS} from "./util/util";

export default class App extends Component {
    constructor(props: Readonly<unknown>) {
        super(props);
        importCSS(localStorage.getItem("theme") || "discord");
    }

    setTheme(theme: string) : void {
        localStorage.setItem("theme", theme);
        importCSS(theme);
    }

    render() {
        return (
            <div id="body">
                <Switch>
                    <Route path="/" component={Home} exact />
                    <Route path="/room/:roomId/" component={JoinRoom} exact />
                    <Route component={Error} />
                </Switch>
            </div>);
    }
}
