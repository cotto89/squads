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

var _validates = require('./../helper/validates.js');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var SharedAction = function () {
    /**
     * @param {Object} options
     * @param {string} options.context
     * @param {Array} [mixins]
     */
    function SharedAction(options) {
        (0, _classCallCheck3.default)(this, SharedAction);
        var context = options.context;
        var mixins = options.mixins;

        this.context = (0, _validates.validateContext)(context) && context;

        var $mixins = Array.isArray(mixins) ? mixins : [];
        var src = _lodash2.default.apply(undefined, (0, _toConsumableArray3.default)($mixins).concat([options]));
        (0, _mixin2.default)(this, src, this, ['context', 'mixins']);
    }

    (0, _createClass3.default)(SharedAction, [{
        key: '_connect',
        value: function _connect(emitter) {
            this._emitter = emitter;
            this._emitter.register(this.context, handler.bind(this));
        }
    }]);
    return SharedAction;
}();

/**
 * @param {string} action
 * @param {any} value
 */
/* eslint-disable no-use-before-define */


exports.default = SharedAction;
function handler(action) {
    var _this = this;

    var $action = this[action];

    (0, _validates.validateActionExistence)(this.context, action, $action);

    for (var _len = arguments.length, value = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
        value[_key - 1] = arguments[_key];
    }

    _promise2.default.resolve($action.apply(undefined, value)).then(function (result) {
        return _this._emitter.publish(_this.context + '.' + action, result);
    }).catch(function (err) {
        return console.error(err);
    });
}
//# sourceMappingURL=SharedAction.js.map