import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { Store, Squad, dispatch } from './../../../dist/index.js';

const counter = new Squad({
    context: 'counter',
    state: { count: 0 },
    afterEach(action, { count }) {
        if (count > 100 || count < -100) {
            return { count: 0 }
        }
    },
    actions: {
        up(num = 1) {
            return { count: this.state.count + num };
        },
        down(num = 1) {
            return { count: this.state.count - num };
        }
    }
});

/* Store */
const store = new Store({
    squads: [counter]
});

/* logger */
store.onChange(status => {
    console.log('==== LOGGER ====');
    for (const context of Object.keys(status)) {
        console.log(context, status[context])
    }
})

/* View */
class Counter extends Component {
    constructor(props) {
        super(props);
        this.state = store.getState('counter');
        this.up = () => dispatch('counter.up');
        this.down = () => dispatch('counter.down');
        this.up10 = () => dispatch({ 'counter.up': 10 });
        this.down10 = () => dispatch({ 'counter.down': 10 });
    }

    componentDidMount() {
        store.onChange(({ counter }) => {
            counter && this.setState(counter);
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
