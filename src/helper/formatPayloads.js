import isPlainObject from 'lodash.isplainobject';
import isString from 'lodash.isstring';
import toPairs from 'lodash.topairs';

/**
 * @param {string|Object|Object[]} payloads
 * @returns {string} context
 */
export default function formatPayloads(payloads) {
    if (isPlainObject(payloads)) {
        return toPairs(payloads).map(([event, value]) => ({
            [event]: value
        }));
    }

    if (isString(payloads)) {
        return [{
            [payloads]: undefined
        }];
    }

    return payloads; // => [{context.action: value}, ...]
}
