import dispatcher from './StateDispatcher.js';

/**
 * Build Squads
 *
 * @param {Object} options
 * @param {Squad[]} [options.squads]
 * @param {SharedAction[]} [options.sharedActions]
 */
export default function store(options) {
    const { squads, sharedActions } = options;

    /* Connect Squads to emitter and dispatcher */
    const $squads = Array.isArray(squads) ? squads : [];
    for (const squad of $squads) {
        squad._connect();
    }

    /* Connect SharedAction to emitter */
    const $shareds = Array.isArray(sharedActions) ? sharedActions : [];
    for (const shared of $shareds) {
        shared._connect();
    }

    /**
     * Return Squads state
     *
     * @returns {Object} state - { context: { state }, ... }
     */
    function getState() {
        const status = {};
        for (const squad of squads) {
            status[squad.context] = squad.state;
        }
        return status;
    }

    /**
     * Listen changing state on Squad.
     *
     * @param {Function} handler
     */
    function onChange(handler) {
        dispatcher.on('state:change', handler);
    }

    /**
     * Remove listener on StateDispatcher.
     *
     * @param {Function} handler
     */
    function unlisten(handler) {
        dispatcher.removeListener('state:change', handler);
    }

    /**
     * Inject state from Store to Squad.
     *
     * @param {Object} state
     */
    function injectState(state) {
        dispatcher.emit('state:inject', state);
    }

    return {
        injectState,
        getState,
        onChange,
        unlisten
    };
}
