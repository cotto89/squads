import assert from 'power-assert';
import cloneDeep from 'lodash.clonedeep';
import isFunction from 'lodash.isfunction';
import { store, dispatch, Squad } from './../../src/index.js';
import dispatcher from './../../src/lib/StateDispatcher.js';
import emitter from './../../src/lib/ActionEmitter.js';
import { counterSrc } from './../fixtures.js';

describe('store()', function() {
    beforeEach(function() {
        this.counter = new Squad(cloneDeep(counterSrc));
        this.store = store({ squads: [this.counter] });
    });

    afterEach(function() {
        emitter._clear();
        dispatcher._clear();
    });

    it('return getState(), onChange()', function() {
        assert(isFunction(this.store.getState));
        assert(isFunction(this.store.onChange));
    });


    describe('getState()', function() {
        it('return squads state', function() {
            assert.deepEqual(this.store.getState(), {
                counter: { count: 0 }
            });
        });
    });


    describe('onChange()', function() {
        it('dispatched nextState', function() {
            this.store.onChange((nextState) => {
                assert.deepEqual(nextState, {
                    counter: { count: 1 }
                });
            });

            dispatch('counter.up');
        });
    });
});
