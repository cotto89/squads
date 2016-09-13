import EventEmitter from 'events';

export class StateDispatcher extends EventEmitter {
    /**
     * @param {string} context
     * @param {Object} state
     */
    dispatchState(context, state) {
        this.emit('state:change', {
            [context]: state
        });
    }

    // for test
    _clear() {
        this._events = {};
    }
}

const dispatcher = new StateDispatcher();
export default dispatcher;
