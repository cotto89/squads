'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _keys = require('babel-runtime/core-js/object/keys');

var _keys2 = _interopRequireDefault(_keys);

var _getIterator2 = require('babel-runtime/core-js/get-iterator');

var _getIterator3 = _interopRequireDefault(_getIterator2);

var _toConsumableArray2 = require('babel-runtime/helpers/toConsumableArray');

var _toConsumableArray3 = _interopRequireDefault(_toConsumableArray2);

var _classCallCheck2 = require('babel-runtime/helpers/classCallCheck');

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _createClass2 = require('babel-runtime/helpers/createClass');

var _createClass3 = _interopRequireDefault(_createClass2);

var _assign = require('babel-runtime/core-js/object/assign');

var _assign2 = _interopRequireDefault(_assign);

var _lodash = require('lodash.merge');

var _lodash2 = _interopRequireDefault(_lodash);

var _lodash3 = require('lodash.isplainobject');

var _lodash4 = _interopRequireDefault(_lodash3);

var _mixin = require('./../helper/mixin.js');

var _mixin2 = _interopRequireDefault(_mixin);

var _errors = require('./../helper/errors.js');

var _validates = require('./../helper/validates.js');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var defaults = {
    state: {},
    setState: function setState(nextState) {
        this.state = (0, _assign2.default)({}, this.state, nextState);
    }
}; /* eslint-disable no-use-before-define */

var Squad = function () {
    (0, _createClass3.default)(Squad, null, [{
        key: 'extend',

        /**
         * Modifier default behavior of Squad
         *
         * @static
         * @param {Object} options
         * @returns Squad
         */
        value: function extend(options) {
            (0, _assign2.default)(defaults, options);
            return this;
        }

        /**
         * @param {Object} options
         * @param {string} options.context
         * @param {Object} options.state
         * @param {Object} [options.actions]
         * @param {Object} [options.subscribe]
         * @param {Object[]} [options.mixins]
         */

    }]);

    function Squad(options) {
        (0, _classCallCheck3.default)(this, Squad);
        var context = options.context;
        var state = options.state;
        var mixins = options.mixins;

        this.state = state || defaults.state;
        this.context = (0, _validates.validateContext)(context) && context;
        this.actions = {};
        this.subscribe = {};
        this.before = {};
        this.after = {};

        var $mixins = Array.isArray(mixins) ? mixins : [];
        var src = _lodash2.default.apply(undefined, (0, _toConsumableArray3.default)($mixins).concat([options]));
        (0, _mixin2.default)(this, src, this, ['context', 'state', 'mixins']);
    }

    /**
     * @param {Object} nextState
     */


    (0, _createClass3.default)(Squad, [{
        key: 'setState',
        value: function setState(nextState) {
            defaults.setState.call(this, nextState);
            return this.state;
        }

        /**
         * Trigger SharedAction
         *
         * @param {string} event - 'context.action'
         * @param {any} [value]
         */

    }, {
        key: 'trigger',
        value: function trigger(event) {
            var _emitter;

            for (var _len = arguments.length, value = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
                value[_key - 1] = arguments[_key];
            }

            (_emitter = this._emitter).trigger.apply(_emitter, [event].concat(value));
        }

        /**
         * Dispatch State on manual and publish event for listener when pass a action.
         * Scenario: When use Promise or async function in action on Squad,
         * use setState and forceUpdate on manual.
         *
         * @param {string} [action]
         *
         * @example
         * action(val) {
         *     Promise.resolve(val)
         *         .then((val) => this.setState({ state: val }))
         *         .then(() => this.forceUpdate('action'))
         * }
         */

    }, {
        key: 'forceUpdate',
        value: function forceUpdate(action) {
            this._dispatcher.dispatchState(this.context, this.state);
            action && this._emitter.publish(this.context + '.' + action, this.state);
        }

        /**
         * Prevent actionHander or listenHandler transaction.
         * When this api is called, no change state, no publish event.
         */

    }, {
        key: 'prevent',
        value: function prevent() {
            throw new _errors.Prevent();
        }

        /**
         * Connect to ActionEmitter(emitter) and StateDispatcher(dispatcher)
         *
         * @param {ActionHandler} emitter
         * @param {EventEmitter} dispatcher
         */

    }, {
        key: '_connect',
        value: function _connect(emitter, dispatcher) {
            this._dispatcher = dispatcher;
            this._emitter = emitter;

            /* Set handler to ActionEmitter */
            this._emitter.onDispatch(this.context, actionHandler.bind(this));

            /* Set subscribe as listeners to ActionEmitter */
            var _iteratorNormalCompletion = true;
            var _didIteratorError = false;
            var _iteratorError = undefined;

            try {
                for (var _iterator = (0, _getIterator3.default)((0, _keys2.default)(this.subscribe)), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
                    var targetEvent = _step.value;

                    this._emitter.on(targetEvent, listenHandler.bind(this));
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
    }]);
    return Squad;
}();

/**
 * @param {string} action
 * @param {any} [value]
 */


exports.default = Squad;
function actionHandler(action) {
    var $action = this.actions[action];
    var nextState = void 0;

    try {
        var _before;

        (0, _validates.validateActionExistence)(this.context, action, $action);
        /*
         * Exec lifecycle and action.
         * When stop transaction, You can use this.prevent()
         */

        for (var _len2 = arguments.length, value = Array(_len2 > 1 ? _len2 - 1 : 0), _key2 = 1; _key2 < _len2; _key2++) {
            value[_key2 - 1] = arguments[_key2];
        }

        this.beforeEach && this.beforeEach.apply(this, [action].concat(value));
        this.before[action] && (_before = this.before)[action].apply(_before, value);
        nextState = $action.apply(undefined, value);

        // https://github.com/cotto89/squads/issues/1
        (0, _validates.refusePromise)(this.context + '.' + action, nextState);

        this.afterEach && this.afterEach(action, nextState);
        this.after[action] && this.after[action](nextState);
    } catch (error) {
        if (error.name === 'Prevent') return;
        if (error.name === 'RefuseError') {
            console.error(error.message);
            return;
        }

        console.error(error);
        return;
    }

    if (!nextState || !(0, _lodash4.default)(nextState)) return;
    this.setState(nextState);
    this._dispatcher.dispatchState(this.context, this.state);
    this._emitter.publish(this.context + '.' + action, this.state);
}

/**
 * @param {string} event
 * @param {any} [value]
 */
function listenHandler(event) {
    var listener = this.subscribe[event];
    var nextState = void 0;

    if (!listener) return;

    try {
        for (var _len3 = arguments.length, value = Array(_len3 > 1 ? _len3 - 1 : 0), _key3 = 1; _key3 < _len3; _key3++) {
            value[_key3 - 1] = arguments[_key3];
        }

        nextState = listener.apply(undefined, value);
        (0, _validates.refusePromise)(event, nextState);
    } catch (error) {
        if (error.name === 'Prevent') return;
        if (error.name === 'RefuseError') {
            console.error(error.message);
            return;
        }

        console.error(error);
        return;
    }

    if (!nextState || !(0, _lodash4.default)(nextState)) return;
    this.setState(nextState);
    this._dispatcher.dispatchState(this.context, this.state);
}
//# sourceMappingURL=Squad.js.map