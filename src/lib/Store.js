import StatusDispatcher from './StatusDispatcher.js';

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
        this.dispatcher = new StatusDispatcher();


        /* Connect Squads to emitter and dispatcher */
        for (const squad of this.squads) {
            squad._connect(this.dispatcher);
        }

        /* Connect SharedAction to emitter */
        for (const shared of this.sharedActions) {
            shared._connect(this.dispatcher);
        }

        this.dispatcher.onRequest('status', () => this.getStatus());
    }

    /**
     * Return Squads status
     *
     * @returns {Object} status
     */
    getStatus() {
        const status = {};
        for (const squad of this.squads) {
            status[squad.context] = squad.state;
        }
        return status;
    }


    /**
     * Return state
     *
     * @param {sting} context
     * @returns {Object} - state
     */
    getState(context) {
        const status = this.getStatus();
        return status[context];
    }

    /**
     * Listen changing state on Squad.
     *
     * @param {Function} handler
     */
    onChange(handler) {
        this.dispatcher.on('state:change', handler);
    }

    /**
     * Remove listener on StatusDispatcher.js.
     *
     * @param {Function} handler
     */
    unlisten(handler) {
        this.dispatcher.removeListener('state:change', handler);
    }

    /**
     * Inject status from Store to Squad.
     *
     * @param {Object} status
     */
    injectStatus(status) {
        this.dispatcher.emit('status:inject', status);
    }
}
