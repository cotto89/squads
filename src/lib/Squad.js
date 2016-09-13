/* eslint-disable no-use-before-define */

import merge from 'lodash.merge';
import isPlainObject from 'lodash.isplainobject';
import mixin from './../helper/mixin.js';
import { Prevent } from './../helper/errors.js';
import { validateContext, refusePromise, validateActionExistence } from './../helper/validates.js';
import dispatcher from './StateDispatcher.js';
import emitter from './ActionEmitter.js';

export default class Squad {
    /**
     * @param {Object} options
     * @param {string} options.context
     * @param {Object} options.state
     * @param {Object} [options.actions]
     * @param {Object} [options.subscribe]
     * @param {Object[]} [options.mixins]
     * @param {Object} [options.before]
     * @param {Object} [options.after]
     * @param {Function} [options.beforeEach]
     * @param {Function} [options.afterEach]
     */
    constructor(options) {
        const { context, state, mixins, beforeEach, afterEach } = options;
        this.state = state || {};
        this.context = validateContext(context) && context;
        this.actions = {};
        this.subscribe = {};
        this.before = {};
        this.after = {};
        this.beforeEach = beforeEach;
        this.afterEach = afterEach;

        const $mixins = Array.isArray(mixins) ? mixins : [];
        const src = merge(...$mixins, options);
        mixin(this, src, this, ['context', 'state', 'mixins']);

        /* Set handler to ActionEmitter */
        emitter.onDispatch(this.context, actionHandler.bind(this));
        /* Set subscribe as listeners to ActionEmitter */
        for (const targetEvent of Object.keys(this.subscribe)) {
            emitter.on(targetEvent, listenHandler.bind(this));
        }
    }

    /**
     * @param {Object} nextState
     */
    setState(nextState) {
        this.state = Object.assign({}, this.state, nextState);
        return this.state;
    }

    /**
     * Trigger SharedAction
     *
     * @param {string} event - 'context.action'
     * @param {any} [value]
     */
    trigger(event, ...value) {
        emitter.trigger(event, ...value);
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
        dispatcher.dispatchState(this.context, this.state);
        action && emitter.publish(`${this.context}.${action}`, this.state);
    }

    /**
     * Prevent actionHander or listenHandler transaction.
     * When this api is called, no change state, no publish event.
     */
    prevent() {
        throw new Prevent();
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
        emitter.publish('$error', error);

        if (error.name === 'Prevent') return;
        if (error.name === 'RefusePromise') {
            if (process.env.NODE_ENV !== 'test') console.error(error.message);
            return;
        }

        console.error(error);
        return;
    }

    if (!nextState || !isPlainObject(nextState)) return;
    this.setState(nextState);
    dispatcher.dispatchState(this.context, this.state);
    emitter.publish(`${this.context}.${action}`, this.state);
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
        emitter.publish('$error', error);

        if (error.name === 'Prevent') return;
        if (error.name === 'RefusePromise') {
            console.error(error.message);
            return;
        }

        console.error(error);
        return;
    }

    if (!nextState || !isPlainObject(nextState)) return;
    this.setState(nextState);
    dispatcher.dispatchState(this.context, this.state);
}
