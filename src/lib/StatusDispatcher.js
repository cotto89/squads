import EventEmitter from 'events';

export class StatusDispatcher extends EventEmitter {
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
    }
}

const dispatcher = new StatusDispatcher();
export default dispatcher;
