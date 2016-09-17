/* eslint-disable no-use-before-define */
import merge from 'lodash.merge';
import mixin from './../helper/mixin.js';
import { Prevent } from './../helper/errors.js';
import { hasContext, hasAction } from './../helper/asserts.js';
import dispatcher from './StatusDispatcher.js';
import emitter from './ActionEmitter.js';
import StateQueue from './../helper/StateQueue.js';

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

        if (process.env.NODE_ENV !== 'production') {
            hasContext(context);
        }

        this.state = state || {};
        this.context = context;
        this.actions = {};
        this.subscribe = {};
        this.before = {};
        this.after = {};
        this.beforeEach = beforeEach;
        this.afterEach = afterEach;

        const $mixins = Array.isArray(mixins) ? mixins : [];
        const src = merge({}, ...$mixins, options);
        mixin(this, src, this, ['context', 'state', 'mixins']);

        /* Inject state from store. */
        dispatcher.on('status:inject', (status) => {
            const $state = status[this.context];
            $state && this.setState($state);
        });
    }

    /**
     * @param {Object} nextState
     */
    setState(...nextState) {
        this.state = Object.assign({}, this.state, ...nextState);
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
    forceUpdate(actionName) {
        if (!actionName) {
            dispatcher.dispatchStatus(this.context, this.state);
            return;
        }

        if (process.env.NODE_ENV !== 'production') {
            hasAction(this.context, actionName, this.actions[actionName]);
        }

        const event = `${this.context}.${actionName}`;
        const queue = new StateQueue(event);

        try {
            queue.push('state', this.state);
            this.afterEach && queue.push('state', this.afterEach(actionName, this.state));
            this.after[actionName] && queue.push('state', this.after[actionName](this.state));
        } catch (error) {
            handleError(error);
            return;
        }

        this.setState(...queue.status.state);
        dispatcher.dispatchStatus(this.context, this.state);
        emitter.publish(event, this.state);
    }

    /**
     * Prevent actionHander or listenerHandler transaction.
     * When this api is called, no change state, no publish event.
     */
    prevent() {
        throw new Prevent();
    }


    /**
     * Connect to ActionEmitter
     */
    _connect() {
        /* Set handler to ActionEmitter */
        emitter.onDispatch(this.context, actionHandler.bind(this));

        /* Set subscribe as listeners to ActionEmitter */
        for (const targetEvent of Object.keys(this.subscribe)) {
            emitter.on(targetEvent, listenerHandler.bind(this));
        }
    }
}

function handleError(error) {
    emitter.publish('$error', error);

    if (error.name === 'Prevent') return;
    if (error.name === 'RefusePromise') {
        if (process.env.NODE_ENV !== 'test') {
            console.error(error.message);
        }
        return;
    }

    console.error(error);
}

/**
 * @param {string} actionName
 * @param {any} [value]
 */
function actionHandler(actionName, value) {
    const action = this.actions[actionName];

    if (process.env.NODE_ENV !== 'production') {
        hasAction(this.context, actionName, action);
    }

    const event = `${this.context}.${actionName}`;
    const queue = new StateQueue(event);
    let actionResult;

    try {
        /*
         * Exec hooks and action.
         * When stop transaction, You can use this.prevent()
         */
        if (this.beforeEach) {
            queue.push('before', this.beforeEach(actionName, value));
        }

        if (this.before[actionName]) {
            queue.push('before', this.before[actionName](value));
        }

        const beforeResult = queue.status.before || [];
        actionResult = action(value, ...beforeResult);
        queue.push('state', actionResult);

        if (actionResult && this.afterEach) {
            queue.push('state', this.afterEach(actionName, actionResult));
        }

        if (actionResult && this.after[actionName]) {
            queue.push('state', this.after[actionName](actionResult));
        }
    } catch (error) {
        handleError(error);
        return;
    }

    if (!actionResult) return;
    this.setState(...queue.status.state);
    dispatcher.dispatchStatus(this.context, this.state);
    emitter.publish(event, this.state);
}


/**
 * @param {string} event
 * @param {any} [value]
 */
function listenerHandler(event, ...value) {
    const listener = this.subscribe[event];
    if (!listener) return;

    const queue = new StateQueue(event);
    let nextState;

    try {
        nextState = listener(...value);
        queue.push('state', nextState);
    } catch (error) {
        handleError(error);
        return;
    }

    if (!nextState || queue.stateCount <= 0) return;
    this.setState(...queue.status.state);
    dispatcher.dispatchStatus(this.context, this.state);
}
