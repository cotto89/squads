/**
 * Split event name into context name and action name
 *
 * @param {string} event
 */
export default function splitEventName(event) {
    const array = event.split('.');
    return {
        context: array.splice(0, array.length - 1).join('.'),
        action: array.join(),
    };
}
