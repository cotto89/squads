import isFunction from 'lodash.isfunction';
import isPlainObject from 'lodash.isplainobject';
import toPairs from 'lodash.topairs';

/**
 * Merge object and auto bind this context
 *
 * @param {Object} master
 * @param {Object} src
 * @param {Object} context
 * @param {String[]} ignore
 */
export default function mixin(master, src = {}, context = {}, ignore = []) {
    for (const [k, v] of toPairs(src)) {
        if (ignore.includes(k)) continue;

        if (isPlainObject(v)) {
            if (!context[k]) context[k] = {};
            mixin(master, v, context[k], ignore);
            continue;
        }

        if (isFunction(v)) {
            context[k] = v.bind(master);
            continue;
        }

        context[k] = v;
    }

    return context;
}
