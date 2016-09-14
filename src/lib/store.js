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
        const state = {};
        for (const squad of squads) {
            state[squad.context] = squad.state;
        }
        return state;
    }

    /**
     * @param {Function} handler
     */
    function onChange(handler) {
        dispatcher.on('state:change', handler);
    }

    return {
        getState,
        onChange
    };
}
