/* eslint-disable import/prefer-default-export*/

import isString from 'lodash.isstring';

export function validateContext(ctx) {
    if (!isString(ctx)) {
        throw new TypeError("'context' is required");
    }
    return true;
}
