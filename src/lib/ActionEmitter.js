/* eslint-disable no-use-before-define */

import formatPayloads from './../helper/formatPayloads.js';
import splitEventName from './../helper/splitEventName.js';
import { validateHandlerExistence, hasRegisteredHandler } from './../helper/validates.js';

/* # MEMO
 * evnet: 'context.action'
 * payload: pear of event and value by Object
 */

export default class ActionEmitter {
    constructor() {
        this.handlers = {};
        this.shareds = {};
        this.listeners = {};
    }

    /**
     * Register callback as action listener
     *
     * @param {string} event
     * @param {Function} listener
     */
    on(event, listener) {
        if (!this.listeners[event]) {
            this.listeners[event] = [];
        }

        this.listeners[event].push(listener);
    }

    /**
     * Publish action result to listeners
     *
     * @param {string} event
     * @param {any} [value]
     */
    publish(event, ...value) {
        const $listeners = this.listeners[event];
        if (!$listeners) return;
        for (const listener of $listeners) {
            listener && listener(event, ...value);
        }
    }

    /**
     * Register ActionHandler from Squad
     *
     * @param {string} context
     * @param {Function} handler - ActionHandler
     */
    onDispatch(context, handler) {
        hasRegisteredHandler(context, this.handlers[context]);
        this.handlers[context] = handler;
    }

    /**
     * Dipatch payload from view and emit ActionHandler
     *
     * @param {string|Object|Object[]} payloads
     * @param {any} [value]
     *
     * @example
     * dispatch('context.action', value)
     * dispatch({ 'context.action': value, 'context.action': value })
     * dispatch([{ context.action: value }, { 'context.action': value }])
     */
    dispatch(payloads, value) {
        const $payloads = formatPayloads(payloads, value);

        for (const payload of $payloads) {
            const event = Object.keys(payload)[0];
            const { context, action } = splitEventName(event);
            const val = payload[event];
            const handler = this.handlers[context];

            validateHandlerExistence(event, handler);
            handler && handler(action, val);
        }
    }

    /**
     * Register SharedAction
     *
     * @param {string} context
     * @param {Function} handler
     */
    register(context, handler) {
        hasRegisteredHandler(context, this.shareds[context]);
        this.shareds[context] = handler;
    }

    /**
     * Trigger SharedAction
     *
     * @param {string} event
     * @param {any} value
     */
    trigger(event, ...value) {
        const { context, action } = splitEventName(event);
        const handler = this.shareds[context];

        validateHandlerExistence(event, handler);
        return handler && handler(action, ...value);
    }


    // for test
    _clear() {
        this.handlers = {};
        this.listeners = {};
        this.shareds = {};
    }
}
