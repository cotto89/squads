'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _defineProperty2 = require('babel-runtime/helpers/defineProperty');

var _defineProperty3 = _interopRequireDefault(_defineProperty2);

var _slicedToArray2 = require('babel-runtime/helpers/slicedToArray');

var _slicedToArray3 = _interopRequireDefault(_slicedToArray2);

exports.default = formatPayloads;

var _lodash = require('lodash.isplainobject');

var _lodash2 = _interopRequireDefault(_lodash);

var _lodash3 = require('lodash.isstring');

var _lodash4 = _interopRequireDefault(_lodash3);

var _lodash5 = require('lodash.topairs');

var _lodash6 = _interopRequireDefault(_lodash5);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * @param {string|Object|Object[]} payloads
 * @param {any} [value]
 */
function formatPayloads(payloads, value) {
    if ((0, _lodash2.default)(payloads)) {
        return (0, _lodash6.default)(payloads).map(function (_ref) {
            var _ref2 = (0, _slicedToArray3.default)(_ref, 2);

            var event = _ref2[0];
            var v = _ref2[1];
            return (0, _defineProperty3.default)({}, event, v);
        });
    }

    if ((0, _lodash4.default)(payloads)) {
        return [(0, _defineProperty3.default)({}, payloads, value)];
    }

    return payloads; // => [{context.action: value}, ...]
}