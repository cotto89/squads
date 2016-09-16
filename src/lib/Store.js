import dispatcher from './StateDispatcher.js';

export default class Store {
    /**
     *
     * @param {Object} options
     * @param {Squad[]} [options.squads]
     * @param {SharedAction[]} [options.sharedActions]
     */
    constructor(options) {
        this.squads = options.squads || [];
        this.sharedActions = options.sharedActions || [];

        /* Connect Squads to emitter and dispatcher */
        for (const squad of this.squads) {
            squad._connect();
        }

        /* Connect SharedAction to emitter */
        for (const shared of this.sharedActions) {
            shared._connect();
        }
    }

    /**
     * Return Squads state
     *
     * @returns {Object} state - { context: { state }, ... }
     */
    getState() {
        const status = {};
        for (const squad of this.squads) {
            status[squad.context] = squad.state;
        }
        return status;
    }

    /**
     * Listen changing state on Squad.
     *
     * @param {Function} handler
     */
    onChange(handler) {
        dispatcher.on('state:change', handler);
    }

    /**
     * Remove listener on StateDispatcher.
     *
     * @param {Function} handler
     */
    unlisten(handler) {
        dispatcher.removeListener('state:change', handler);
    }

    /**
     * Inject state from Store to Squad.
     *
     * @param {Object} state
     */
    injectState(state) {
        dispatcher.emit('state:inject', state);
    }
}
