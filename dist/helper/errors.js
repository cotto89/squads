'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.Prevent = exports.RefuseError = undefined;

var _getPrototypeOf = require('babel-runtime/core-js/object/get-prototype-of');

var _getPrototypeOf2 = _interopRequireDefault(_getPrototypeOf);

var _classCallCheck2 = require('babel-runtime/helpers/classCallCheck');

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _possibleConstructorReturn2 = require('babel-runtime/helpers/possibleConstructorReturn');

var _possibleConstructorReturn3 = _interopRequireDefault(_possibleConstructorReturn2);

var _inherits2 = require('babel-runtime/helpers/inherits');

var _inherits3 = _interopRequireDefault(_inherits2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var RefuseError = exports.RefuseError = function (_Error) {
    (0, _inherits3.default)(RefuseError, _Error);

    function RefuseError() {
        var _ref;

        (0, _classCallCheck3.default)(this, RefuseError);

        for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
            args[_key] = arguments[_key];
        }

        var _this = (0, _possibleConstructorReturn3.default)(this, (_ref = RefuseError.__proto__ || (0, _getPrototypeOf2.default)(RefuseError)).call.apply(_ref, [this].concat(args)));

        _this.name = 'RefuseError';
        return _this;
    }

    return RefuseError;
}(Error);

var Prevent = exports.Prevent = function (_Error2) {
    (0, _inherits3.default)(Prevent, _Error2);

    function Prevent() {
        var _ref2;

        (0, _classCallCheck3.default)(this, Prevent);

        for (var _len2 = arguments.length, args = Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
            args[_key2] = arguments[_key2];
        }

        var _this2 = (0, _possibleConstructorReturn3.default)(this, (_ref2 = Prevent.__proto__ || (0, _getPrototypeOf2.default)(Prevent)).call.apply(_ref2, [this].concat(args)));

        _this2.name = 'Prevent';
        return _this2;
    }

    return Prevent;
}(Error);
//# sourceMappingURL=errors.js.map