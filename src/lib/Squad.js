import merge from 'lodash.merge';
import isPlainObject from 'lodash.isplainobject';
import { validateContext } from './../helper/validates.js';
import mixin from './../helper/mixin.js';

// TODO: lifecycle
// TODO: trigger SharedAction

const defaults = {
    state: {},
    setState(nextState) {
        this.state = Object.assign({}, this.state, nextState);
    },
};

export default class Squad {
    /**
     * Modifier default behavior of Squad
     *
     * @static
     * @param {Object} options
     * @returns Squad
     */
    static extend(options) {
        Object.assign(defaults, options);
        return this;
    }


    /**
     * @param {Object} options
     * @param {string} options.context
     * @param {Object} options.state
     * @param {Object} [options.actions]
     * @param {Object} [options.subscribe]
     * @param {Object[]} [options.mixin]
     */
    constructor(options) {
        const { context, state, mixins } = options;
        this.state = state || defaults.state;
        this.context = validateContext(context) && context;
        this.actions = {};
        this.subscribe = {};

        const $mixins = Array.isArray(mixins) ? mixins : [];
        const src = merge(...$mixins, options);
        mixin(this, src, this, ['context', 'state', 'mixins']);
    }

    /**
     * @param {Object} nextState
     */
    setState(nextState) {
        defaults.setState.call(this, nextState);
        return this.state;
    }

    /**
     * Connect to ActionEmitter, StateDispatcher(dispatcher)
     *
     * @param {ActionHandler} handler
     * @param {EventEmitter} dispatcher
     */
    __connect__(emitter, dispatcher) {
        this.dispatcher = dispatcher;
        this.emitter = emitter;

        /* Set handler to ActionEmitter */
        this.emitter.onDispatch(this.context, (action, ...value) => {
            const $action = this.actions[action];

            if (!$action) {
                console.error(`Can not find ${action} in ${this.context}`);
                return undefined;
            }

            // Useing promise because action can return Promise
            return $action && Promise.resolve($action(...value))
                .then(nextState => {
                    if (nextState && isPlainObject(nextState)) {
                        this.setState(nextState);
                        this.emitter.publish(`${this.context}.${action}`, this.state);
                        this.dispatcher.dispatchState(this.context, this.state);
                    }
                });
        });

        /* Set subscribe as listeners to ActionEmitter */
        const $subscribe = this.subscribe;
        for (const targetEvent of Object.keys($subscribe)) {
            this.emitter.on(targetEvent, (...value) => {
                const listener = $subscribe[targetEvent];

                listener && Promise.resolve(listener(...value))
                    .then(nextState => {
                        if (nextState && isPlainObject(nextState)) {
                            this.setState(nextState);
                            this.dispatcher.dispatchState(this.context, this.state);
                        }
                    });
            });
        }
    }
}
