import assert from 'power-assert';
import cloneDeep from 'lodash.clonedeep';
import { Store, dispatch, Squad } from './../../src/index.js';
import dispatcher from './../../src/lib/StatusDispatcher.js';
import emitter from './../../src/lib/ActionEmitter.js';
import { counterSrc } from './../fixtures.js';

describe('Store', function() {
    beforeEach(function() {
        this.counter = new Squad(cloneDeep(counterSrc));
        this.store = new Store({ squads: [this.counter] });
    });


    afterEach(function() {
        emitter._clear();
        dispatcher._clear();
    });

    describe('#injectStatus()', function() {
        it('dispatch state to Squad', function() {
            dispatcher.on('state:inject', (status) => {
                assert.deepEqual(status, { context: { state: true } });
            });

            this.store.injectStatus({ context: { state: true } });
        });
    });

    describe('#getStatus()', function() {
        it('return squads status', function() {
            assert.deepEqual(this.store.getStatus(), {
                counter: { count: 0 }
            });
        });
    });


    describe('#getState()', function() {
        it('return squad state', function() {
            assert.deepEqual(this.store.getState('counter'), { count: 0 });
        });
    });


    describe('#onChange()', function() {
        it('dispatched nextState', function() {
            this.store.onChange((nextState) => {
                assert.deepEqual(nextState, {
                    counter: { count: 1 }
                });
            });

            dispatch('counter.up');
        });
    });


    describe('#unlisten()', function() {
        it('remove listener from StatusDispatcher', function() {
            const handlerA = () => {};
            const handlerB = () => {};
            this.store.onChange(handlerA);
            this.store.onChange(handlerB);
            assert.strictEqual(dispatcher._events['state:change'].length, 2);

            this.store.unlisten(handlerA);
            assert.strictEqual(dispatcher._events['state:change'].length, 1);
        });
    });
});
