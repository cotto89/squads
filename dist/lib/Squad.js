'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _keys = require('babel-runtime/core-js/object/keys');

var _keys2 = _interopRequireDefault(_keys);

var _getIterator2 = require('babel-runtime/core-js/get-iterator');

var _getIterator3 = _interopRequireDefault(_getIterator2);

var _assign = require('babel-runtime/core-js/object/assign');

var _assign2 = _interopRequireDefault(_assign);

var _toConsumableArray2 = require('babel-runtime/helpers/toConsumableArray');

var _toConsumableArray3 = _interopRequireDefault(_toConsumableArray2);

var _classCallCheck2 = require('babel-runtime/helpers/classCallCheck');

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _createClass2 = require('babel-runtime/helpers/createClass');

var _createClass3 = _interopRequireDefault(_createClass2);

var _lodash = require('lodash.merge');

var _lodash2 = _interopRequireDefault(_lodash);

var _mixin = require('./../helper/mixin.js');

var _mixin2 = _interopRequireDefault(_mixin);

var _errors = require('./../helper/errors.js');

var _asserts = require('./../helper/asserts.js');

var _StateDispatcher = require('./StateDispatcher.js');

var _StateDispatcher2 = _interopRequireDefault(_StateDispatcher);

var _ActionEmitter = require('./ActionEmitter.js');

var _ActionEmitter2 = _interopRequireDefault(_ActionEmitter);

var _StateQueue = require('./../helper/StateQueue.js');

var _StateQueue2 = _interopRequireDefault(_StateQueue);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var Squad = function () {
    /**
     * @param {Object} options
     * @param {string} options.context
     * @param {Object} options.state
     * @param {Object} [options.actions]
     * @param {Object} [options.subscribe]
     * @param {Object[]} [options.mixins]
     * @param {Object} [options.before]
     * @param {Object} [options.after]
     * @param {Function} [options.beforeEach]
     * @param {Function} [options.afterEach]
     */
    function Squad(options) {
        var _this = this;

        (0, _classCallCheck3.default)(this, Squad);
        var context = options.context;
        var state = options.state;
        var mixins = options.mixins;
        var beforeEach = options.beforeEach;
        var afterEach = options.afterEach;


        if (process.env.NODE_ENV !== 'production') {
            (0, _asserts.hasContext)(context);
        }

        this.state = state || {};
        this.context = context;
        this.actions = {};
        this.subscribe = {};
        this.before = {};
        this.after = {};
        this.beforeEach = beforeEach;
        this.afterEach = afterEach;

        var $mixins = Array.isArray(mixins) ? mixins : [];
        var src = _lodash2.default.apply(undefined, [{}].concat((0, _toConsumableArray3.default)($mixins), [options]));
        (0, _mixin2.default)(this, src, this, ['context', 'state', 'mixins']);

        /* Inject state from store. */
        _StateDispatcher2.default.on('state:inject', function (status) {
            var $state = status[_this.context];
            $state && _this.setState($state);
        });
    }

    /**
     * @param {Object} nextState
     */


    (0, _createClass3.default)(Squad, [{
        key: 'setState',
        value: function setState() {
            for (var _len = arguments.length, nextState = Array(_len), _key = 0; _key < _len; _key++) {
                nextState[_key] = arguments[_key];
            }

            this.state = _assign2.default.apply(Object, [{}, this.state].concat(nextState));
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
            for (var _len2 = arguments.length, value = Array(_len2 > 1 ? _len2 - 1 : 0), _key2 = 1; _key2 < _len2; _key2++) {
                value[_key2 - 1] = arguments[_key2];
            }

            _ActionEmitter2.default.trigger.apply(_ActionEmitter2.default, [event].concat(value));
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
        value: function forceUpdate(actionName) {
            if (!actionName) {
                _StateDispatcher2.default.dispatchState(this.context, this.state);
                return;
            }

            if (process.env.NODE_ENV !== 'production') {
                (0, _asserts.hasAction)(this.context, actionName, this.actions[actionName]);
            }

            var event = this.context + '.' + actionName;
            var queue = new _StateQueue2.default(event);

            try {
                queue.push(this.state);
                this.afterEach && queue.push(this.afterEach(actionName, this.state));
                this.after[actionName] && queue.push(this.after[actionName](this.state));
            } catch (error) {
                handleError(error);
                return;
            }

            this.setState.apply(this, (0, _toConsumableArray3.default)(queue.status));
            _StateDispatcher2.default.dispatchState(this.context, this.state);
            _ActionEmitter2.default.publish(event, this.state);
        }

        /**
         * Prevent actionHander or listenerHandler transaction.
         * When this api is called, no change state, no publish event.
         */

    }, {
        key: 'prevent',
        value: function prevent() {
            throw new _errors.Prevent();
        }

        /**
         * Connect to ActionEmitter
         */

    }, {
        key: '_connect',
        value: function _connect() {
            /* Set handler to ActionEmitter */
            _ActionEmitter2.default.onDispatch(this.context, actionHandler.bind(this));

            /* Set subscribe as listeners to ActionEmitter */
            var _iteratorNormalCompletion = true;
            var _didIteratorError = false;
            var _iteratorError = undefined;

            try {
                for (var _iterator = (0, _getIterator3.default)((0, _keys2.default)(this.subscribe)), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
                    var targetEvent = _step.value;

                    _ActionEmitter2.default.on(targetEvent, listenerHandler.bind(this));
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
}(); /* eslint-disable no-use-before-define */


exports.default = Squad;


function handleError(error) {
    _ActionEmitter2.default.publish('$error', error);

    if (error.name === 'Prevent') return;
    if (error.name === 'RefusePromise') {
        if (process.env.NODE_ENV !== 'test') {
            console.error(error.message);
        }
        return;
    }

    console.error(error);
}

/**
 * @param {string} actionName
 * @param {any} [value]
 */
function actionHandler(actionName) {
    var action = this.actions[actionName];

    if (process.env.NODE_ENV !== 'production') {
        (0, _asserts.hasAction)(this.context, actionName, action);
    }

    var event = this.context + '.' + actionName;
    var queue = new _StateQueue2.default(event);
    var actionResult = void 0;

    try {
        var _before;

        for (var _len3 = arguments.length, value = Array(_len3 > 1 ? _len3 - 1 : 0), _key3 = 1; _key3 < _len3; _key3++) {
            value[_key3 - 1] = arguments[_key3];
        }

        /*
         * Exec hooks and action.
         * When stop transaction, You can use this.prevent()
         */
        this.beforeEach && this.beforeEach.apply(this, [actionName].concat(value));
        this.before[actionName] && (_before = this.before)[actionName].apply(_before, value);

        actionResult = action.apply(undefined, value);
        queue.push(actionResult);

        if (actionResult && this.afterEach) {
            queue.push(this.afterEach(actionName, actionResult));
        }

        if (actionResult && this.after[actionName]) {
            queue.push(this.after[actionName](actionResult));
        }
    } catch (error) {
        handleError(error);
        return;
    }

    if (!actionResult) return;
    this.setState.apply(this, (0, _toConsumableArray3.default)(queue.status));
    _StateDispatcher2.default.dispatchState(this.context, this.state);
    _ActionEmitter2.default.publish(event, this.state);
}

/**
 * @param {string} event
 * @param {any} [value]
 */
function listenerHandler(event) {
    var listener = this.subscribe[event];
    if (!listener) return;

    var queue = new _StateQueue2.default(event);
    var nextState = void 0;

    try {
        for (var _len4 = arguments.length, value = Array(_len4 > 1 ? _len4 - 1 : 0), _key4 = 1; _key4 < _len4; _key4++) {
            value[_key4 - 1] = arguments[_key4];
        }

        nextState = listener.apply(undefined, value);
        queue.push(nextState);
    } catch (error) {
        handleError(error);
        return;
    }

    if (!nextState || queue.stateCount <= 0) return;
    this.setState.apply(this, (0, _toConsumableArray3.default)(queue.status));
    _StateDispatcher2.default.dispatchState(this.context, this.state);
}