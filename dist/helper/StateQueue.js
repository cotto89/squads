'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _classCallCheck2 = require('babel-runtime/helpers/classCallCheck');

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _createClass2 = require('babel-runtime/helpers/createClass');

var _createClass3 = _interopRequireDefault(_createClass2);

var _asserts = require('./asserts.js');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var StateQueue = function () {
    /**
     * @param {string} event
     */
    function StateQueue(event) {
        (0, _classCallCheck3.default)(this, StateQueue);

        this.event = event;
        this.status = {
            state: []
        };
    }

    (0, _createClass3.default)(StateQueue, [{
        key: 'push',
        value: function push(key, value) {
            if (process.env.NODE_ENV !== 'production') {
                (0, _asserts.refusePromise)(this.event, value);
            }

            if (!this.status[key]) {
                this.status[key] = [];
            }

            this.status[key].push(value);
            return this.status;
        }
    }, {
        key: 'stateCount',
        get: function get() {
            return this.status.state.length;
        }
    }]);
    return StateQueue;
}();

exports.default = StateQueue;