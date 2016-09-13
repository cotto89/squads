'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _slicedToArray2 = require('babel-runtime/helpers/slicedToArray');

var _slicedToArray3 = _interopRequireDefault(_slicedToArray2);

var _getIterator2 = require('babel-runtime/core-js/get-iterator');

var _getIterator3 = _interopRequireDefault(_getIterator2);

exports.default = mixin;

var _lodash = require('lodash.isfunction');

var _lodash2 = _interopRequireDefault(_lodash);

var _lodash3 = require('lodash.isplainobject');

var _lodash4 = _interopRequireDefault(_lodash3);

var _lodash5 = require('lodash.topairs');

var _lodash6 = _interopRequireDefault(_lodash5);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * Merge object and auto bind this context
 *
 * @param {Object} master
 * @param {Object} src
 * @param {Object} context
 * @param {String[]} ignore
 */
function mixin(master) {
    var src = arguments.length <= 1 || arguments[1] === undefined ? {} : arguments[1];
    var context = arguments.length <= 2 || arguments[2] === undefined ? {} : arguments[2];
    var ignore = arguments.length <= 3 || arguments[3] === undefined ? [] : arguments[3];
    var _iteratorNormalCompletion = true;
    var _didIteratorError = false;
    var _iteratorError = undefined;

    try {
        for (var _iterator = (0, _getIterator3.default)((0, _lodash6.default)(src)), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
            var _step$value = (0, _slicedToArray3.default)(_step.value, 2);

            var k = _step$value[0];
            var v = _step$value[1];

            if (ignore.includes(k)) continue;

            if ((0, _lodash4.default)(v)) {
                if (!context[k]) context[k] = {};
                mixin(master, v, context[k], ignore);
                continue;
            }

            if ((0, _lodash2.default)(v)) {
                context[k] = v.bind(master);
                continue;
            }

            context[k] = v;
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

    return context;
}