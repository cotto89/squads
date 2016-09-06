'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _defineProperty2 = require('babel-runtime/helpers/defineProperty');

var _defineProperty3 = _interopRequireDefault(_defineProperty2);

var _getPrototypeOf = require('babel-runtime/core-js/object/get-prototype-of');

var _getPrototypeOf2 = _interopRequireDefault(_getPrototypeOf);

var _classCallCheck2 = require('babel-runtime/helpers/classCallCheck');

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _createClass2 = require('babel-runtime/helpers/createClass');

var _createClass3 = _interopRequireDefault(_createClass2);

var _possibleConstructorReturn2 = require('babel-runtime/helpers/possibleConstructorReturn');

var _possibleConstructorReturn3 = _interopRequireDefault(_possibleConstructorReturn2);

var _inherits2 = require('babel-runtime/helpers/inherits');

var _inherits3 = _interopRequireDefault(_inherits2);

var _events = require('events');

var _events2 = _interopRequireDefault(_events);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var StateDispatcher = function (_EventEmitter) {
    (0, _inherits3.default)(StateDispatcher, _EventEmitter);

    function StateDispatcher() {
        (0, _classCallCheck3.default)(this, StateDispatcher);
        return (0, _possibleConstructorReturn3.default)(this, (StateDispatcher.__proto__ || (0, _getPrototypeOf2.default)(StateDispatcher)).apply(this, arguments));
    }

    (0, _createClass3.default)(StateDispatcher, [{
        key: 'dispatchState',

        /**
         * @param {string} context
         * @param {Object} state
         */
        value: function dispatchState(context, state) {
            this.emit('state:change', (0, _defineProperty3.default)({}, context, state));
        }

        // for test

    }, {
        key: '_clear',
        value: function _clear() {
            this._events = {};
        }
    }]);
    return StateDispatcher;
}(_events2.default);

exports.default = StateDispatcher;
//# sourceMappingURL=StateDispatcher.js.map