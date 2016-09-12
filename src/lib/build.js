import dispatcher from './StateDispatcher.js';

/**
 * Build Squads
 *
 * @param {Object} options
 * @param {Squad[]} [options.squads]
 * @param {SharedAction[]} [options.sharedActions]
 */
export default function build(options) {
    const { squads } = options;

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
