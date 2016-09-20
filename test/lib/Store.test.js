import assert from 'power-assert';
import sinon from 'sinon';
import cloneDeep from 'lodash.clonedeep';
import { Store, dispatch, Squad } from './../../src/index.js';
import emitter from './../../src/lib/ActionEmitter.js';
import { counterSrc } from './../fixtures.js';

describe('Store', function() {
    beforeEach(function() {
        this.counter = new Squad(cloneDeep(counterSrc));
        this.store = new Store({ squads: [this.counter] });
        this.spyHandler = sinon.spy();
    });

    afterEach(function() {
        emitter._clear();
        this.store.dispatcher._clear();
        this.spyHandler.reset();
    });

    describe('#injectStatus()', function() {
        it('dispatch state to Squad', function() {
            this.store.dispatcher.on('status:inject', this.spyHandler);
            this.store.injectStatus({ context: { state: true } });
            assert(this.spyHandler.calledWith({ context: { state: true } }));
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
            this.store.onChange(this.spyHandler);
            dispatch('counter.up');
            assert(this.spyHandler.calledWith({ counter: { count: 1 } }));
        });
    });


    describe('#unlisten()', function() {
        it('remove listener from StatusDispatcher', function() {
            const handlerA = () => {};
            const handlerB = () => {};
            this.store.onChange(handlerA);
            this.store.onChange(handlerB);
            assert.strictEqual(this.store.dispatcher._events['state:change'].length, 2);

            this.store.unlisten(handlerA);
            assert.strictEqual(this.store.dispatcher._events['state:change'].length, 1);
        });
    });
});
