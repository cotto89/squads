'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _getIterator2 = require('babel-runtime/core-js/get-iterator');

var _getIterator3 = _interopRequireDefault(_getIterator2);

var _classCallCheck2 = require('babel-runtime/helpers/classCallCheck');

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _createClass2 = require('babel-runtime/helpers/createClass');

var _createClass3 = _interopRequireDefault(_createClass2);

var _StatusDispatcher = require('./StatusDispatcher.js');

var _StatusDispatcher2 = _interopRequireDefault(_StatusDispatcher);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var Store = function () {
    /**
     *
     * @param {Object} options
     * @param {Squad[]} [options.squads]
     * @param {SharedAction[]} [options.sharedActions]
     */
    function Store(options) {
        var _this = this;

        (0, _classCallCheck3.default)(this, Store);

        this.squads = options.squads || [];
        this.sharedActions = options.sharedActions || [];
        this.dispatcher = new _StatusDispatcher2.default();

        /* Connect Squads to emitter and dispatcher */
        var _iteratorNormalCompletion = true;
        var _didIteratorError = false;
        var _iteratorError = undefined;

        try {
            for (var _iterator = (0, _getIterator3.default)(this.squads), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
                var squad = _step.value;

                squad._connect(this.dispatcher);
            }

            /* Connect SharedAction to emitter */
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

        var _iteratorNormalCompletion2 = true;
        var _didIteratorError2 = false;
        var _iteratorError2 = undefined;

        try {
            for (var _iterator2 = (0, _getIterator3.default)(this.sharedActions), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
                var shared = _step2.value;

                shared._connect(this.dispatcher);
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

        this.dispatcher.onRequest('status', function () {
            return _this.getStatus();
        });
    }

    /**
     * Return Squads status
     *
     * @returns {Object} status
     */


    (0, _createClass3.default)(Store, [{
        key: 'getStatus',
        value: function getStatus() {
            var status = {};
            var _iteratorNormalCompletion3 = true;
            var _didIteratorError3 = false;
            var _iteratorError3 = undefined;

            try {
                for (var _iterator3 = (0, _getIterator3.default)(this.squads), _step3; !(_iteratorNormalCompletion3 = (_step3 = _iterator3.next()).done); _iteratorNormalCompletion3 = true) {
                    var squad = _step3.value;

                    status[squad.context] = squad.state;
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

            return status;
        }

        /**
         * Return state
         *
         * @param {sting} context
         * @returns {Object} - state
         */

    }, {
        key: 'getState',
        value: function getState(context) {
            var status = this.getStatus();
            return status[context];
        }

        /**
         * Listen changing state on Squad.
         *
         * @param {Function} handler
         */

    }, {
        key: 'onChange',
        value: function onChange(handler) {
            this.dispatcher.on('state:change', handler);
        }

        /**
         * Remove listener on StatusDispatcher.js.
         *
         * @param {Function} handler
         */

    }, {
        key: 'unlisten',
        value: function unlisten(handler) {
            this.dispatcher.removeListener('state:change', handler);
        }

        /**
         * Inject status from Store to Squad.
         *
         * @param {Object} status
         */

    }, {
        key: 'injectStatus',
        value: function injectStatus(status) {
            this.dispatcher.emit('status:inject', status);
        }
    }]);
    return Store;
}();

exports.default = Store;