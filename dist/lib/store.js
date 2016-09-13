'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _getIterator2 = require('babel-runtime/core-js/get-iterator');

var _getIterator3 = _interopRequireDefault(_getIterator2);

exports.default = store;

var _StateDispatcher = require('./StateDispatcher.js');

var _StateDispatcher2 = _interopRequireDefault(_StateDispatcher);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * Build Squads
 *
 * @param {Object} options
 * @param {Squad[]} [options.squads]
 * @param {SharedAction[]} [options.sharedActions]
 */
function store(options) {
    var squads = options.squads;

    /**
     * Return Squads state
     *
     * @returns {Object} state - { context: { state }, ... }
     */

    function getState() {
        var state = {};
        var _iteratorNormalCompletion = true;
        var _didIteratorError = false;
        var _iteratorError = undefined;

        try {
            for (var _iterator = (0, _getIterator3.default)(squads), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
                var squad = _step.value;

                state[squad.context] = squad.state;
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

        return state;
    }

    /**
     * @param {Function} handler
     */
    function onChange(handler) {
        _StateDispatcher2.default.on('state:change', handler);
    }

    return {
        getState: getState,
        onChange: onChange
    };
}