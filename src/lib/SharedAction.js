/* eslint-disable no-use-before-define */
import merge from 'lodash.merge';
import mixin from './../helper/mixin.js';
import { validateContext, validateActionExistence } from './../helper/validates.js';

export default class SharedAction {
    /**
     * @param {Object} options
     * @param {string} options.context
     * @param {Array} [mixins]
     */
    constructor(options) {
        const { context, mixins } = options;
        this.context = validateContext(context) && context;

        const $mixins = Array.isArray(mixins) ? mixins : [];
        const src = merge(...$mixins, options);
        mixin(this, src, this, ['context', 'mixins']);
    }

    _connect(emitter) {
        this._emitter = emitter;
        this._emitter.register(this.context, handler.bind(this));
    }
}

/**
 * @param {string} action
 * @param {any} value
 */
function handler(action, ...value) {
    const $action = this[action];

    validateActionExistence(this.context, action, $action);

    Promise.resolve($action(...value))
        .then(result => this._emitter.publish(`${this.context}.${action}`, result))
        .catch(err => console.error(err));
}
