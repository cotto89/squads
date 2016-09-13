import isString from 'lodash.isstring';
import { RefusePromise } from './errors.js';

export function validateContext(ctx) {
    if (!isString(ctx)) {
        throw new TypeError("'context' is required");
    }
    return true;
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

export function validateHandlerExistence(event, handler) {
    if (!handler) {
        throw new ReferenceError(`Cannot find handler on ${event}`);
    }
}

export function validateActionExistence(context, action, target) {
    if (!target) {
        throw new ReferenceError(`Can not find action: "${action}" in ${context}`);
    }
}
