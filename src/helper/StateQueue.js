import { refusePromise } from './asserts.js';

export default class StateQueue {
    /**
     * @param {string} event
     */
    constructor(event) {
        this.event = event;
        this.status = {
            state: []
        };
    }

    get stateCount() {
        return this.status.state.length;
    }

    push(key, value) {
        if (process.env.NODE_ENV !== 'production') {
            refusePromise(this.event, value);
        }

        if (!this.status[key]) {
            this.status[key] = [];
        }

        this.status[key].push(value);
        return this.status;
    }
}
