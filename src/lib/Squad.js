/* eslint-disable no-use-before-define */

import merge from 'lodash.merge';
import isPlainObject from 'lodash.isplainobject';
import { validateContext } from './../helper/validates.js';
import mixin from './../helper/mixin.js';
import Prevent from './../helper/PreventError.js';

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
     * @param {Object[]} [options.mixin]
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
     * @param {any} value
     */
    trigger(event, ...value) {
        this._emitter.trigger(event, ...value);
    }

    /**
     * Dispatch State on manual
     * Publish event for listener when pass a action
     * Scenario: When use Promise in SquadAction, use setState and forceUpdate on manual
     *
     * @param {string} [action]
     */
    forceUpdate(action) {
        this._dispatcher.dispatchState(this.context, this.state);
        action && this._emitter.publish(`${this.context}.${action}`, this.state);
    }

    /**
     * Prevent transaction
     */
    prevent() {
        throw new Prevent();
    }


    /**
     * Connect to ActionEmitter, StateDispatcher(dispatcher)
     *
     * @param {ActionHandler} handler
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
 * @param {any} value
 */
function actionHandler(action, ...value) {
    const $action = this.actions[action];
    let nextState;

    if (!$action) {
        console.error(`Can not find ${action} in ${this.context}`);
        return;
    }

    try {
        /*
         * Exec lifecycle and action.
         * When stop transaction, You can use this.prevent()
         */
        this.beforeEach && this.beforeEach(action, ...value);
        this.before[action] && this.before[action](...value);
        nextState = $action(...value);

        // https://github.com/cotto89/squads/issues/1
        if (nextState instanceof Promise) {
            throw new TypeError(`"${this.context}.${action}" returned Promise. ` +
                'Squad.actions cannot be accepted Promise. ' +
                'You can use SharedAction for async action.');
        }

        this.afterEach && this.afterEach(action, nextState);
        this.after[action] && this.after[action](nextState);
    } catch (error) {
        if (!(error.name === 'Prevent')) console.error(error);
        return;
    }

    if (!nextState || !isPlainObject(nextState)) return;
    this.setState(nextState);
    this._dispatcher.dispatchState(this.context, this.state);
    this._emitter.publish(`${this.context}.${action}`, this.state);
}


/**
 * @param {string} event
 * @param {any} value
 */
function listenHandler(event, ...value) {
    const listener = this.subscribe[event];
    let nextState;

    if (!listener) return;

    try {
        nextState = listener(...value);
        // https://github.com/cotto89/squads/issues/1
        if (nextState instanceof Promise) {
            throw new TypeError(
                `listener on "${event}" at "${this.context}" returned Promise. ` +
                'Squad.subscribe cannot be accepted Promise. ' +
                'You can use SharedAction for async action.');
        }
    } catch (error) {
        if (!(error.name === 'Prevent')) console.error(error);
        return;
    }

    if (!nextState || !isPlainObject(nextState)) return;
    this.setState(nextState);
    this._dispatcher.dispatchState(this.context, this.state);
}
