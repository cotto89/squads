'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _promise = require('babel-runtime/core-js/promise');

var _promise2 = _interopRequireDefault(_promise);

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

var _asserts = require('./../helper/asserts.js');

var _ActionEmitter = require('./ActionEmitter.js');

var _ActionEmitter2 = _interopRequireDefault(_ActionEmitter);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/* eslint-disable no-use-before-define */
var SharedAction = function () {
    /**
     * @param {Object} options
     * @param {string} options.context
     * @param {Object[]} [options.mixins]
     */
    function SharedAction(options) {
        (0, _classCallCheck3.default)(this, SharedAction);
        var context = options.context;
        var mixins = options.mixins;


        if (process.env.NODE_ENV !== 'production') {
            (0, _asserts.hasContext)(context);
        }

        this.context = context;

        var $mixins = Array.isArray(mixins) ? mixins : [];
        var src = _lodash2.default.apply(undefined, [{}].concat((0, _toConsumableArray3.default)($mixins), [options]));
        (0, _mixin2.default)(this, src, this, ['context', 'mixins']);
    }

    /**
     * Connect to ActionEmitter
     */


    (0, _createClass3.default)(SharedAction, [{
        key: '_connect',
        value: function _connect() {
            /* Set handler to ActionEmitter */
            _ActionEmitter2.default.register(this.context, handler.bind(this));
        }
    }]);
    return SharedAction;
}();

/**
 * @param {string} actionName
 * @param {any} [value]
 */


exports.default = SharedAction;
function handler(actionName) {
    var action = this[actionName];
    var event = this.context + '.' + actionName;

    if (process.env.NODE_ENV !== 'production') {
        (0, _asserts.hasAction)(this.context, actionName, action);
    }

    for (var _len = arguments.length, value = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
        value[_key - 1] = arguments[_key];
    }

    _promise2.default.resolve(action.apply(undefined, value)).then(function (result) {
        return _ActionEmitter2.default.publish(event, result);
    }).catch(function (err) {
        _ActionEmitter2.default.publish('$error', err);
        console.error(err);
    });
}