'use strict';

var _Squad = require('./lib/Squad.js');

var _Squad2 = _interopRequireDefault(_Squad);

var _SharedAction = require('./lib/SharedAction.js');

var _SharedAction2 = _interopRequireDefault(_SharedAction);

var _build = require('./lib/build.js');

var _build2 = _interopRequireDefault(_build);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

module.exports = {
    build: _build2.default,
    dispatch: _build.dispatch,
    Squad: _Squad2.default,
    SharedAction: _SharedAction2.default
};
//# sourceMappingURL=index.js.map