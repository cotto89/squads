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

var StatusDispatcher = function (_EventEmitter) {
    (0, _inherits3.default)(StatusDispatcher, _EventEmitter);

    function StatusDispatcher() {
        var _ref;

        (0, _classCallCheck3.default)(this, StatusDispatcher);

        for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
            args[_key] = arguments[_key];
        }

        var _this = (0, _possibleConstructorReturn3.default)(this, (_ref = StatusDispatcher.__proto__ || (0, _getPrototypeOf2.default)(StatusDispatcher)).call.apply(_ref, [this].concat(args)));

        _this._messages = {};
        return _this;
    }

    /**
     * @param {string} subject
     * @param {Function} response
     */


    (0, _createClass3.default)(StatusDispatcher, [{
        key: 'onRequest',
        value: function onRequest(subject, response) {
            if (!this._messages[subject]) {
                this._messages[subject] = response;
            }
        }

        /**
         * @param {string} subject
         * @returns response
         */

    }, {
        key: 'request',
        value: function request(subject) {
            var response = this._messages[subject];
            return response && response();
        }

        /**
         * @param {string} context
         * @param {Object} state
         */

    }, {
        key: 'dispatchStatus',
        value: function dispatchStatus(context, state) {
            this.emit('state:change', (0, _defineProperty3.default)({}, context, state));
        }

        // for test

    }, {
        key: '_clear',
        value: function _clear() {
            this._events = {};
            this._messages = {};
        }
    }]);
    return StatusDispatcher;
}(_events2.default);

exports.default = StatusDispatcher;