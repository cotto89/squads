/* eslint-disable no-use-before-define */
import merge from 'lodash.merge';
import mixin from './../helper/mixin.js';
import { hasContext, hasAction } from './../helper/asserts.js';
import emitter from './ActionEmitter.js';


export default class SharedAction {
    /**
     * @param {Object} options
     * @param {string} options.context
     * @param {Object[]} [options.mixins]
     */
    constructor(options) {
        const { context, mixins } = options;

        if (process.env.NODE_ENV !== 'production') {
            hasContext(context);
        }

        this.context = context;

        const $mixins = Array.isArray(mixins) ? mixins : [];
        const src = merge(...$mixins, options);
        mixin(this, src, this, ['context', 'mixins']);
        emitter.register(this.context, handler.bind(this));
    }
}

/**
 * @param {string} actionName
 * @param {any} [value]
 */
function handler(actionName, ...value) {
    const action = this[actionName];

    if (process.env.NODE_ENV !== 'production') {
        hasAction(this.context, actionName, action);
    }

    Promise.resolve(action(...value))
        .then(result => emitter.publish(`${this.context}.${actionName}`, result))
        .catch(err => {
            emitter.publish('$error', err);
            console.error(err);
        });
}
