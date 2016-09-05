/* eslint-disable no-use-before-define */

import formatPayloads from './../helper/formatPayloads.js';
import splitEventName from './../helper/splitEventName.js';

/* # MEMO
 * evnet: 'context.action'
 * payload: pear of event and value by Object
 */

/*
TODO: SharedAction
* trigger
* register
*/

/*
TODO: 1 dispatch 1render (process)
TODO: 同processで同じSharedActionを1度だけしか呼びさせないようにする
 */

export default class ActionEmitter {
    constructor() {
        this.handlers = {};
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
     * Register ActionHandler from Squad
     *
     * @param {string} context
     * @param {Function} handler - ActionHandler
     */
    onDispatch(context, handler) {
        if (this.handlers[context]) {
            throw new Error(`${context} handler is already exists`);
        }
        this.handlers[context] = handler;
    }


    /**
     * Dipatch payload from view and emit handler
     *
     * @param {string|Object|Object[]} payloads
     *
     * @example
     * dispatch('context.action')
     * dispatch({ 'context.action': value, 'context.action': value })
     * dispatch([{ context.action: value }, { 'context.action': value }])
     */
    dispatch(payloads) {
        const $payloads = formatPayloads(payloads);

        for (const payload of $payloads) {
            const event = Object.keys(payload)[0];
            const { context, action } = splitEventName(event);
            const value = payload[event];
            const handler = this.handlers[context];

            if (!handler) {
                console.error(`Cannot find handler at ${event} in ActionEmitter`);
            }

            handler && handler(action, value);
        }
    }

    /**
     * Publish action result to listeners
     *
     * @param {string} event
     * @param {any} value
     */
    publish(event, ...value) {
        const $listeners = this.listeners[event];
        if (!$listeners) return;
        for (const listener of $listeners) {
            listener && listener(event, ...value);
        }
    }

    // for test
    __clear__() {
        this.handlers = {};
        this.listeners = {};
    }
}
