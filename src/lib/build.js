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
 * @param {SharedAction[]} [options.squads]
 */
export default function build(options) {
    const { squads, shareds } = options;

    /* Connect squads to ActionEmitter */
    const $squads = squads || [];
    for (const squad of $squads) {
        squad._connect(emitter, dispatcher);
    }

    /* Connect SharedActions to ActionEmitter */
    const $shareds = shareds || [];
    for (const shared of $shareds) {
        shared._connect(emitter);
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
        dispatch
    };
}
