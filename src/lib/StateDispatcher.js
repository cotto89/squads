import EventEmitter from 'events';

export default class StateDispatcher extends EventEmitter {
    /**
     * @param {string} context
     * @param {Object} state
     */
    dispatchState(context, state) {
        this.emit('state:change', {
            [context]: state,
        });
    }
}
