'use strict';

var _Squad = require('./lib/Squad.js');

var _Squad2 = _interopRequireDefault(_Squad);

var _SharedAction = require('./lib/SharedAction.js');

var _SharedAction2 = _interopRequireDefault(_SharedAction);

var _store = require('./lib/store.js');

var _store2 = _interopRequireDefault(_store);

var _ActionEmitter = require('./lib/ActionEmitter.js');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

module.exports = {
    store: _store2.default,
    dispatch: _ActionEmitter.dispatch,
    Squad: _Squad2.default,
    SharedAction: _SharedAction2.default
};