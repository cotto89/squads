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

var Processor = function () {
    function Processor(event) {
        (0, _classCallCheck3.default)(this, Processor);

        this.event = event;
        this.state = [];
    }

    (0, _createClass3.default)(Processor, [{
        key: 'pushState',
        value: function pushState(value) {
            if (process.env.NODE_ENV !== 'production') {
                (0, _asserts.refusePromise)(this.event, value);
            }

            this.state.push(value);
            return this.state;
        }
    }, {
        key: 'stateCount',
        get: function get() {
            return this.state.length;
        }
    }]);
    return Processor;
}();

exports.default = Processor;