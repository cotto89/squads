import ActionEmitter from './ActionEmitter.js';
import StateDispatcher from './StateDispatcher.js';

export const emitter = new ActionEmitter();
export const dispatcher = new StateDispatcher();
export const dispatch = emitter.dispatch.bind(emitter);

/**
 * Build Squads
 *
 * @param {Object} options
 * @param {Squad[]} [options.squads]
 * @param {SharedAction[]} [options.sharedActions]
 */
export default function build(options) {
    const { squads, sharedActions } = options;

    /* Connect squads to ActionEmitter */
    const $squads = squads || [];
    for (const squad of $squads) {
        squad.__connect__(emitter, dispatcher);
    }

    /* Connect SharedActions to ActionEmitter */
    const $sharedActions = sharedActions || [];
    for (const shared of $sharedActions) {
        shared.___connect__(emitter);
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
        onChange,
        dispatch
    };
}
