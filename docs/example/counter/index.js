/* eslint-disable import/no-extraneous-dependencies */
import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { build, Squad, dispatch } from './../../../src/index.js';

require('./index.scss');

const counter = new Squad({
    context: 'counter',
    state: { count: 0 },
    actions: {
        up(num = 1) {
            return { count: this.state.count + num };
        },
        down(num = 1) {
            return { count: this.state.count - num };
        }
    }
});

const app = build({
    squads: [counter]
});

class Counter extends Component {
    constructor(props) {
        super(props);
        this.state = app.getState().counter;
        this.up = () => dispatch('counter.up');
        this.down = () => dispatch('counter.down');
        this.up10 = () => dispatch({ 'counter.up': 10 });
        this.down10 = () => dispatch({ 'counter.down': 10 });
    }

    componentDidMount() {
        app.onChange(nextState => {
            this.setState(nextState.counter);
        });
    }

    render() {
        return (
            <div className="container">
                <h1>Squad Sample Counter</h1>
                <div className="counter">
                    <div className="count">{this.state.count}</div>
                    <div className="controller">
                        <button onClick={this.up}>+ 1</button>
                        <button onClick={this.down}>- 1</button>
                        <button onClick={this.up10}>+ 10</button>
                        <button onClick={this.down10}>- 10</button>
                    </div>
                </div>
            </div>
        );
    }
}

window.addEventListener('DOMContentLoaded', () => {
    ReactDOM.render(<Counter />, document.querySelector('#app'));
});
