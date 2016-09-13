'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.default = splitEventName;
/**
 * Split event name into context name and action name
 *
 * @param {string} event - 'context.action'
 */
function splitEventName(event) {
    var array = event.split('.');
    return {
        context: array.splice(0, array.length - 1).join('.'),
        action: array.join()
    };
}