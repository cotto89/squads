import isPlainObject from 'lodash.isplainobject';
import isString from 'lodash.isstring';
import toPairs from 'lodash.topairs';

/**
 * @param {string|Object|Object[]} payloads
 * @param {any} [value]
 */
export default function formatPayloads(payloads, value) {
    if (isPlainObject(payloads)) {
        return toPairs(payloads).map(([event, v]) => ({
            [event]: v
        }));
    }

    if (isString(payloads)) {
        return [{
            [payloads]: value
        }];
    }

    return payloads; // => [{context.action: value}, ...]
}
