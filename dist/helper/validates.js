'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _promise = require('babel-runtime/core-js/promise');

var _promise2 = _interopRequireDefault(_promise);

exports.validateContext = validateContext;
exports.hasRegisteredHandler = hasRegisteredHandler;
exports.refusePromise = refusePromise;
exports.validateHandlerExistence = validateHandlerExistence;
exports.validateActionExistence = validateActionExistence;

var _lodash = require('lodash.isstring');

var _lodash2 = _interopRequireDefault(_lodash);

var _errors = require('./errors.js');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/* eslint-disable import/prefer-default-export*/

function validateContext(ctx) {
    if (!(0, _lodash2.default)(ctx)) {
        throw new TypeError("'context' is required");
    }
    return true;
}

function hasRegisteredHandler(context, handler) {
    if (handler) {
        throw new Error('"' + context + '" handler is already exists');
    }
}

function refusePromise(event, value) {
    if (value instanceof _promise2.default) {
        throw new _errors.RefuseError('"' + event + '" returned Promise. But Squad cannot be accepted Promise. ' + 'You can use SharedAction for async action.');
    }
}

function validateHandlerExistence(event, handler) {
    if (!handler) {
        throw new ReferenceError('Cannot find handler on ' + event);
    }
}

function validateActionExistence(context, action, target) {
    if (!target) {
        throw new ReferenceError('Can not find action: "' + action + '" in ' + context);
    }
}
//# sourceMappingURL=validates.js.map