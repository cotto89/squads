/* eslint-disable no-new */
import assert from 'power-assert';
import merge from 'lodash.merge';
import cloneDeep from 'lodash.clonedeep';
import { Store, dispatch, Squad } from './../../src/index.js';
import emitter from './../../src/lib/ActionEmitter.js';
import { counterSrc, sharedSrc } from './../fixtures.js';

describe('Squad hooks', function() {
    beforeEach(function() {
        this.counterSrc = cloneDeep(counterSrc);
        this.sharedSrc = cloneDeep(sharedSrc);
    });

    afterEach(function() {
        emitter._clear();
    });

    it('emit hooks around action is emitting', function() {
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

    it('can pass value form before(Each) hook to action', function() {
        const counter = new Squad(merge(this.counterSrc, {
            before: {
                up(value) {
                    return value * 10;
                }
            },
            beforeEach(action, value) {
                return {
                    [action]: value * 10
                };
            },
            actions: {
                up(num = 1, ...beforeResult) {
                    assert.deepEqual(beforeResult, [{ up: 10 }, 10]);
                }
            }
        }));

        new Store({ squads: [counter] });
        dispatch('counter.up', 1);
    });


    it('can modify state by after hook when return state', function() {
        const counter = new Squad(merge(this.counterSrc, {
            after: {
                up(state) {
                    return { count: state.count * 10 };
                }
            }
        }));

        new Store({ squads: [counter] });

        assert.deepEqual(counter.state, { count: 0 });
        dispatch('counter.up', 10);
        assert.deepEqual(counter.state, { count: 100 });
    });


    it('can modify state by afterEach when return state', function() {
        const counter = new Squad(merge(this.counterSrc, {
            afterEach(action, state) {
                if (action === 'up') {
                    return { count: state.count * 10 };
                }
                return state;
            }
        }));

        new Store({ squads: [counter] });

        assert.deepEqual(counter.state, { count: 0 });
        dispatch('counter.up', 10);
        assert.deepEqual(counter.state, { count: 100 });
    });
});
