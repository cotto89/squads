import { refusePromise } from './asserts.js';

export default class Processor {
    constructor(event) {
        this.event = event;
        this.state = [];
    }

    get stateCount() {
        return this.state.length;
    }

    pushState(value) {
        if (process.env.NODE_ENV !== 'production') {
            refusePromise(this.event, value);
        }

        this.state.push(value);
        return this.state;
    }
}
