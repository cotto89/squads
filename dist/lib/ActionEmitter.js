'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _keys = require('babel-runtime/core-js/object/keys');

var _keys2 = _interopRequireDefault(_keys);

var _getIterator2 = require('babel-runtime/core-js/get-iterator');

var _getIterator3 = _interopRequireDefault(_getIterator2);

var _classCallCheck2 = require('babel-runtime/helpers/classCallCheck');

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _createClass2 = require('babel-runtime/helpers/createClass');

var _createClass3 = _interopRequireDefault(_createClass2);

var _formatPayloads = require('./../helper/formatPayloads.js');

var _formatPayloads2 = _interopRequireDefault(_formatPayloads);

var _splitEventName3 = require('./../helper/splitEventName.js');

var _splitEventName4 = _interopRequireDefault(_splitEventName3);

var _validates = require('./../helper/validates.js');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/* # MEMO
 * evnet: 'context.action'
 * payload: pear of event and value by Object
 */

/*
TODO: 1 dispatch 1render (process)
TODO: 同processで同じSharedActionを1度だけしか呼びさせないようにする
 */

var ActionEmitter = function () {
    function ActionEmitter() {
        (0, _classCallCheck3.default)(this, ActionEmitter);

        this.handlers = {};
        this.shareds = {};
        this.listeners = {};
    }

    /**
     * Register callback as action listener
     *
     * @param {string} event
     * @param {Function} listener
     */


    (0, _createClass3.default)(ActionEmitter, [{
        key: 'on',
        value: function on(event, listener) {
            if (!this.listeners[event]) {
                this.listeners[event] = [];
            }

            this.listeners[event].push(listener);
        }

        /**
         * Publish action result to listeners
         *
         * @param {string} event
         * @param {any} value
         */

    }, {
        key: 'publish',
        value: function publish(event) {
            var $listeners = this.listeners[event];
            if (!$listeners) return;

            for (var _len = arguments.length, value = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
                value[_key - 1] = arguments[_key];
            }

            var _iteratorNormalCompletion = true;
            var _didIteratorError = false;
            var _iteratorError = undefined;

            try {
                for (var _iterator = (0, _getIterator3.default)($listeners), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
                    var listener = _step.value;

                    listener && listener.apply(undefined, [event].concat(value));
                }
            } catch (err) {
                _didIteratorError = true;
                _iteratorError = err;
            } finally {
                try {
                    if (!_iteratorNormalCompletion && _iterator.return) {
                        _iterator.return();
                    }
                } finally {
                    if (_didIteratorError) {
                        throw _iteratorError;
                    }
                }
            }
        }

        /**
         * Register ActionHandler from Squad
         *
         * @param {string} context
         * @param {Function} handler - ActionHandler
         */

    }, {
        key: 'onDispatch',
        value: function onDispatch(context, handler) {
            (0, _validates.hasRegisteredHandler)(context, this.handlers[context]);
            this.handlers[context] = handler;
        }

        /**
         * Dipatch payload from view and emit handler
         *
         * @param {string|Object|Object[]} payloads
         *
         * @example
         * dispatch('context.action')
         * dispatch({ 'context.action': value, 'context.action': value })
         * dispatch([{ context.action: value }, { 'context.action': value }])
         */

    }, {
        key: 'dispatch',
        value: function dispatch(payloads) {
            var $payloads = (0, _formatPayloads2.default)(payloads);

            var _iteratorNormalCompletion2 = true;
            var _didIteratorError2 = false;
            var _iteratorError2 = undefined;

            try {
                for (var _iterator2 = (0, _getIterator3.default)($payloads), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
                    var payload = _step2.value;

                    var event = (0, _keys2.default)(payload)[0];

                    var _splitEventName = (0, _splitEventName4.default)(event);

                    var context = _splitEventName.context;
                    var action = _splitEventName.action;

                    var _value = payload[event];
                    var handler = this.handlers[context];

                    (0, _validates.validateHandlerExistence)(event, handler);
                    handler && handler(action, _value);
                }
            } catch (err) {
                _didIteratorError2 = true;
                _iteratorError2 = err;
            } finally {
                try {
                    if (!_iteratorNormalCompletion2 && _iterator2.return) {
                        _iterator2.return();
                    }
                } finally {
                    if (_didIteratorError2) {
                        throw _iteratorError2;
                    }
                }
            }
        }

        /**
         * Register SharedAction
         *
         * @param {string} context
         * @param {Function} handler
         */

    }, {
        key: 'register',
        value: function register(context, handler) {
            (0, _validates.hasRegisteredHandler)(context, this.shareds[context]);
            this.shareds[context] = handler;
        }

        /**
         * Trigger SharedAction
         *
         * @param {string} event
         * @param {any} value
         */

    }, {
        key: 'trigger',
        value: function trigger(event) {
            var _splitEventName2 = (0, _splitEventName4.default)(event);

            var context = _splitEventName2.context;
            var action = _splitEventName2.action;

            var handler = this.shareds[context];

            (0, _validates.validateHandlerExistence)(event, handler);

            for (var _len2 = arguments.length, value = Array(_len2 > 1 ? _len2 - 1 : 0), _key2 = 1; _key2 < _len2; _key2++) {
                value[_key2 - 1] = arguments[_key2];
            }

            return handler && handler.apply(undefined, [action].concat(value));
        }

        // for test

    }, {
        key: '_clear',
        value: function _clear() {
            this.handlers = {};
            this.listeners = {};
            this.shareds = {};
        }
    }]);
    return ActionEmitter;
}(); /* eslint-disable no-use-before-define */

exports.default = ActionEmitter;
//# sourceMappingURL=ActionEmitter.js.map