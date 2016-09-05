import ActionEmitter from './ActionEmitter.js';
import StateDispatcher from './StateDispatcher.js';

export const emitter = new ActionEmitter();
export const dispatcher = new StateDispatcher();
export const dispatch = emitter.dispatch;

/**
 * Build Squads
 *
 * @param {Object} options
 * @param {Squad[]} options.squads
 */
export default function build(options) {
    const { squads } = options;

    /* Connect squads to ActionEmitter */
    for (const squad of squads) {
        squad.__connect__(emitter, dispatcher);
    }

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
        dispatch: emitter.dispatch
    };
}
