import Squad from './lib/Squad.js';
import SharedAction from './lib/SharedAction.js';
import store from './lib/store.js';
import { dispatch } from './lib/ActionEmitter.js';

module.exports = {
    store,
    dispatch,
    Squad,
    SharedAction
};
