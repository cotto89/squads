/* eslint-disable no-new */
import assert from 'power-assert';
import merge from 'lodash.merge';
import cloneDeep from 'lodash.clonedeep';
import { Store, dispatch, Squad, SharedAction } from './../../src/index.js';
import dispatcher from './../../src/lib/StatusDispatcher.js';
import emitter from './../../src/lib/ActionEmitter.js';
import { counterSrc, sharedSrc } from './../fixtures.js';

describe('Squad hooks', function() {
    beforeEach(function() {
        this.counterSrc = cloneDeep(counterSrc);
        this.sharedSrc = cloneDeep(sharedSrc);
        this.shared = new SharedAction(this.sharedSrc);
        this.counter = new Squad(this.counterSrc);
        this.store = new Store({ squads: [this.counter], sharedActionss: [this.shared] });
    });

    afterEach(function() {
        emitter._clear();
        dispatcher._clear();
    });

    it('emit hooks when around action is emitting', function() {
        const hookResult = [];
        const counter = new Squad(merge(this.counterSrc, {
            context: '$counter',
            beforeEach(action, value) {
                hookResult.push({
                    beforeEach: {
                        [action]: value
                    }
                });
            },
            afterEach(action, state) {
                hookResult.push({
                    afterEach: {
                        [action]: state
                    }
                });
            },
            before: {
                up(value) {
                    hookResult.push({ before: value });
                }
            },
            after: {
                up(state) {
                    hookResult.push({ after: state });
                }
            }
        }));

        new Store({ squads: [counter] });

        dispatch('$counter.up', 10);
        assert.deepEqual(hookResult, [
            { beforeEach: { up: 10 } },
            { before: 10 },
            { afterEach: { up: { count: 10 } } },
            { after: { count: 10 } }
        ]);
    });

    it('can modify state by after when return state', function() {
        const counter = new Squad(merge(this.counterSrc, {
            context: '$counter',
            after: {
                up(state) {
                    return { count: state.count * 10 };
                }
            }
        }));

        new Store({ squads: [counter] });

        assert.deepEqual(counter.state, { count: 0 });
        dispatch('$counter.up', 10);
        assert.deepEqual(counter.state, { count: 100 });
    });


    it('can modify state by afterEach when return state', function() {
        const counter = new Squad(merge(this.counterSrc, {
            context: '$counter',
            afterEach(action, state) {
                if (action === 'up') {
                    return { count: state.count * 10 };
                }
                return state;
            }
        }));

        new Store({ squads: [counter] });

        assert.deepEqual(counter.state, { count: 0 });
        dispatch('$counter.up', 10);
        assert.deepEqual(counter.state, { count: 100 });
    });
});
