import { refusePromise } from './asserts.js';

export default class StateQueue {
    /**
     * @param {string} event
     */
    constructor(event) {
        this.event = event;
        this.status = [];
    }

    get stateCount() {
        return this.status.length;
    }

    push(value) {
        if (process.env.NODE_ENV !== 'production') {
            refusePromise(this.event, value);
        }

        this.status.push(value);
        return this.status;
    }
}
