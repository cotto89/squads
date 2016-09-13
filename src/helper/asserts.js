import isString from 'lodash.isstring';
import { RefusePromise } from './errors.js';

export function hasContext(ctx) {
    if (!isString(ctx)) {
        throw new TypeError("'context' is required");
    }
}

export function hasRegisteredHandler(context, handler) {
    if (handler) {
        throw new Error(`"${context}" handler is already exists`);
    }
}

export function refusePromise(event, value) {
    if (value instanceof Promise) {
        throw new RefusePromise(
            `"${event}" returned Promise. But Squad cannot be accepted Promise. ` +
            'You can use SharedAction for async action.'
        );
    }
}

export function hasHandler(event, handler) {
    if (!handler) {
        throw new ReferenceError(`Cannot find handler on ${event}`);
    }
}

export function hasAction(context, action, target) {
    if (!target) {
        throw new ReferenceError(`Cannot find action: "${action}" in ${context}`);
    }
}
