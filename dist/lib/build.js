'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.dispatch = exports.dispatcher = exports.emitter = undefined;

var _getIterator2 = require('babel-runtime/core-js/get-iterator');

var _getIterator3 = _interopRequireDefault(_getIterator2);

exports.default = build;

var _ActionEmitter = require('./ActionEmitter.js');

var _ActionEmitter2 = _interopRequireDefault(_ActionEmitter);

var _StateDispatcher = require('./StateDispatcher.js');

var _StateDispatcher2 = _interopRequireDefault(_StateDispatcher);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var emitter = exports.emitter = new _ActionEmitter2.default();
var dispatcher = exports.dispatcher = new _StateDispatcher2.default();
var dispatch = exports.dispatch = emitter.dispatch.bind(emitter);

/**
 * Build Squads
 *
 * @param {Object} options
 * @param {Squad[]} [options.squads]
 * @param {SharedAction[]} [options.squads]
 */
function build(options) {
    var squads = options.squads;
    var sharedActions = options.sharedActions;

    /* Connect squads to ActionEmitter */

    var $squads = squads || [];
    var _iteratorNormalCompletion = true;
    var _didIteratorError = false;
    var _iteratorError = undefined;

    try {
        for (var _iterator = (0, _getIterator3.default)($squads), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
            var squad = _step.value;

            squad._connect(emitter, dispatcher);
        }

        /* Connect SharedActions to ActionEmitter */
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

    var $sharedActions = sharedActions || [];
    var _iteratorNormalCompletion2 = true;
    var _didIteratorError2 = false;
    var _iteratorError2 = undefined;

    try {
        for (var _iterator2 = (0, _getIterator3.default)($sharedActions), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
            var shared = _step2.value;

            shared._connect(emitter);
        }
    } catch (err) {
        _didIteratorError2 = true;
        _iteratorError2 = err;
    } finally {
        try {
            if (!_iteratorNormalCompletion2 && _iterator2.return) {
                _iterator2.return();
            }
        } finally {
            if (_didIteratorError2) {
                throw _iteratorError2;
            }
        }
    }

    function getState() {
        var state = {};
        var _iteratorNormalCompletion3 = true;
        var _didIteratorError3 = false;
        var _iteratorError3 = undefined;

        try {
            for (var _iterator3 = (0, _getIterator3.default)(squads), _step3; !(_iteratorNormalCompletion3 = (_step3 = _iterator3.next()).done); _iteratorNormalCompletion3 = true) {
                var squad = _step3.value;

                state[squad.context] = squad.state;
            }
        } catch (err) {
            _didIteratorError3 = true;
            _iteratorError3 = err;
        } finally {
            try {
                if (!_iteratorNormalCompletion3 && _iterator3.return) {
                    _iterator3.return();
                }
            } finally {
                if (_didIteratorError3) {
                    throw _iteratorError3;
                }
            }
        }

        return state;
    }

    /**
     * @param {Function} handler
     */
    function onChange(handler) {
        dispatcher.on('state:change', handler);
    }

    return {
        getState: getState,
        onChange: onChange,
        dispatch: dispatch
    };
}
//# sourceMappingURL=build.js.map