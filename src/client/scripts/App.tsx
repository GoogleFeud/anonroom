

import React, { Component} from 'react';
import { Route, Switch } from 'react-router-dom';


function Home() {
    return <p>Home!</p>
}

function About() {
    return <p>About</p>
}

function Shop() {
    return <p>Shop</p>
}

function Error() {
    return <p>Error!</p>
}

export default class App extends Component {
    constructor(props: Readonly<{}>) {
        super(props);
    }

    render() {
        return (<div>
            <Switch>
                <Route path="/" component={Home} exact />
                <Route path="/about" component={About} />
                <Route path="/shop" component={Shop} />
                <Route component={Error} />
            </Switch>
        </div>)
    }
}