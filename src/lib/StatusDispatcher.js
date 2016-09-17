import EventEmitter from 'events';

export default class StatusDispatcher extends EventEmitter {
    constructor(...args) {
        super(...args);
        this._messages = {};
    }

    /**
     * @param {string} subject
     * @param {Function} response
     */
    onRequest(subject, response) {
        if (!this._messages[subject]) {
            this._messages[subject] = response;
        }
    }

    /**
     * @param {string} subject
     * @returns response
     */
    request(subject) {
        const response = this._messages[subject];
        return response && response();
    }

    /**
     * @param {string} context
     * @param {Object} state
     */
    dispatchStatus(context, state) {
        this.emit('state:change', {
            [context]: state
        });
    }

    // for test
    _clear() {
        this._events = {};
        this._messages = {};
    }
}
