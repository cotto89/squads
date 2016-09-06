/* eslint-disable no-use-before-define */

import merge from 'lodash.merge';
import isPlainObject from 'lodash.isplainobject';
import mixin from './../helper/mixin.js';
import { Prevent } from './../helper/errors.js';
import { validateContext, refusePromise, validateActionExistence } from './../helper/validates.js';

const defaults = {
    state: {},
    setState(nextState) {
        this.state = Object.assign({}, this.state, nextState);
    }
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
     * @param {Object[]} [options.mixins]
     */
    constructor(options) {
        const { context, state, mixins } = options;
        this.state = state || defaults.state;
        this.context = validateContext(context) && context;
        this.actions = {};
        this.subscribe = {};
        this.before = {};
        this.after = {};

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
     * Trigger SharedAction
     *
     * @param {string} event - 'context.action'
     * @param {any} [value]
     */
    trigger(event, ...value) {
        this._emitter.trigger(event, ...value);
    }

    /**
     * Dispatch State on manual and publish event for listener when pass a action.
     * Scenario: When use Promise or async function in action on Squad,
     * use setState and forceUpdate on manual.
     *
     * @param {string} [action]
     *
     * @example
     * action(val) {
     *     Promise.resolve(val)
     *         .then((val) => this.setState({ state: val }))
     *         .then(() => this.forceUpdate('action'))
     * }
     */
    forceUpdate(action) {
        this._dispatcher.dispatchState(this.context, this.state);
        action && this._emitter.publish(`${this.context}.${action}`, this.state);
    }

    /**
     * Prevent actionHander or listenHandler transaction.
     * When this api is called, no change state, no publish event.
     */
    prevent() {
        throw new Prevent();
    }


    /**
     * Connect to ActionEmitter(emitter) and StateDispatcher(dispatcher)
     *
     * @param {ActionHandler} emitter
     * @param {EventEmitter} dispatcher
     */
    _connect(emitter, dispatcher) {
        this._dispatcher = dispatcher;
        this._emitter = emitter;

        /* Set handler to ActionEmitter */
        this._emitter.onDispatch(this.context, actionHandler.bind(this));

        /* Set subscribe as listeners to ActionEmitter */
        for (const targetEvent of Object.keys(this.subscribe)) {
            this._emitter.on(targetEvent, listenHandler.bind(this));
        }
    }
}

/**
 * @param {string} action
 * @param {any} [value]
 */
function actionHandler(action, ...value) {
    const $action = this.actions[action];
    let nextState;

    try {
        validateActionExistence(this.context, action, $action);
        /*
         * Exec lifecycle and action.
         * When stop transaction, You can use this.prevent()
         */
        this.beforeEach && this.beforeEach(action, ...value);
        this.before[action] && this.before[action](...value);
        nextState = $action(...value);

        // https://github.com/cotto89/squads/issues/1
        refusePromise(`${this.context}.${action}`, nextState);

        this.afterEach && this.afterEach(action, nextState);
        this.after[action] && this.after[action](nextState);
    } catch (error) {
        if (error.name === 'Prevent') return;
        if (error.name === 'RefuseError') {
            console.error(error.message);
            return;
        }

        console.error(error);
        return;
    }

    if (!nextState || !isPlainObject(nextState)) return;
    this.setState(nextState);
    this._dispatcher.dispatchState(this.context, this.state);
    this._emitter.publish(`${this.context}.${action}`, this.state);
}


/**
 * @param {string} event
 * @param {any} [value]
 */
function listenHandler(event, ...value) {
    const listener = this.subscribe[event];
    let nextState;

    if (!listener) return;

    try {
        nextState = listener(...value);
        refusePromise(event, nextState);
    } catch (error) {
        if (error.name === 'Prevent') return;
        if (error.name === 'RefuseError') {
            console.error(error.message);
            return;
        }

        console.error(error);
        return;
    }

    if (!nextState || !isPlainObject(nextState)) return;
    this.setState(nextState);
    this._dispatcher.dispatchState(this.context, this.state);
}
