/* eslint-disable no-new */
import assert from 'power-assert';
import merge from 'lodash.merge';
import cloneDeep from 'lodash.clonedeep';
import sinon from 'sinon';
import { Store, dispatch, Squad } from './../../../src/index.js';
import emitter from './../../../src/lib/ActionEmitter.js';
import { counterSrc, sharedSrc } from './../../fixtures.js';

describe('Squad hooks', function() {
    beforeEach(function() {
        this.counterSrc = cloneDeep(counterSrc);
        this.sharedSrc = cloneDeep(sharedSrc);
    });

    afterEach(function() {
        emitter._clear();
    });

    it('emit hooks around action is emitting', function() {
        const beforeEachSpy = sinon.spy();
        const beforeSpy = sinon.spy();
        const afterEachSpy = sinon.spy();
        const afterSpy = sinon.spy();

        const counter = new Squad(merge(this.counterSrc, {
            context: '$counter',
            beforeEach: beforeEachSpy,
            afterEach: afterEachSpy,
            before: { up: beforeSpy },
            after: { up: afterSpy }
        }));

        new Store({ squads: [counter] });

        dispatch('$counter.up', 10);

        assert(beforeEachSpy.calledWith('up', 10));
        assert(beforeSpy.calledWith(10));
        assert(afterEachSpy.calledWith('up', { count: 10 }));
        assert(afterSpy.calledWith({ count: 10 }));
    });

    it('can pass value form before(Each) hook to action', function() {
        const beforeSpy = sinon.spy(count => count * 10);
        const beforeEachSpy = sinon.spy((action, count) => ({
            [action]: count * 10
        }));
        const upSpy = sinon.spy();

        const counter = new Squad(merge(this.counterSrc, {
            before: { up: beforeSpy },
            beforeEach: beforeEachSpy,
            actions: { up: upSpy }
        }));

        new Store({ squads: [counter] });
        dispatch('counter.up', 1);

        assert(upSpy.calledWithExactly(1, { up: 10 }, 10));
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
