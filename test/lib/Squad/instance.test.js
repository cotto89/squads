/* eslint-disable no-new */
import assert from 'power-assert';
import sinon from 'sinon';
import merge from 'lodash.merge';
import cloneDeep from 'lodash.clonedeep';
import isFunction from 'lodash.isfunction';
import { Store, Squad, SharedAction } from './../../../src/index.js';
import emitter from './../../../src/lib/ActionEmitter.js';
import { counterSrc, sharedSrc } from './../../fixtures.js';

describe('Squad', function() {
    beforeEach(function() {
        this.counterSrc = cloneDeep(counterSrc);
        this.sharedSrc = cloneDeep(sharedSrc);
        this.shared = new SharedAction(this.sharedSrc);
        this.counter = new Squad(this.counterSrc);
        this.store = new Store({ squads: [this.counter], sharedActions: [this.shared] });
    });

    afterEach(function() {
        emitter._clear();
        this.store.dispatcher._clear();
    });


    describe('#constructor', function() {
        specify('squad default props', function() {
            const expect = [
                'state',
                'context',
                'actions',
                'subscribe',
                'before',
                'after',
                'beforeEach',
                'afterEach'
            ];
            expect.forEach((exp) => {
                assert(Object.keys(this.counter).indexOf(exp) > -1);
            });
        });


        it('is bound functional option', function() {
            const actionFn = () => {};
            const subscribeFn = () => {};
            const extraFn = () => {};

            const counter = new Squad({
                context: '$counter',
                state: {},
                actions: { actionFn },
                subscribe: { subscribeFn },
                extraFn
            });

            assert.notDeepStrictEqual(counter.actions.actionFn, actionFn);
            assert.notDeepStrictEqual(counter.subscribe.subscribeFn, subscribeFn);
            assert.notDeepStrictEqual(counter.extraFn, extraFn);
        });


        it('listen on state:inject on dispatcher', function() {
            this.store.injectStatus({ counter: { count: 10 } });
            assert.deepEqual(this.counter.state, { count: 10 });
            this.store.injectStatus({ $$$counter: { count: 100 } });
            assert.deepEqual(this.counter.state, { count: 10 });
        });
    });

    describe('#_connect()', function() {
        it('add handler and listener to ActionEmitter', function() {
            assert.deepEqual(Object.keys(emitter.handlers), ['counter']);
            assert.deepEqual(Object.keys(emitter.listeners), ['shared.clear', 'shared.asyncClear']);
            assert(isFunction(emitter.handlers.counter));
            assert(isFunction(emitter.listeners['shared.clear'][0]));
        });
    });

    describe('#getAppStatus', function() {
        it('return AppStatus', function() {
            const counterA = new Squad(merge(this.counterSrc, { context: 'counterA' }));
            const counterB = new Squad(merge(this.counterSrc, { context: 'counterB' }));
            const counterC = new Squad(merge(this.counterSrc, { context: 'counterC' }));
            new Store({ squads: [counterA, counterB, counterC] });
            assert.deepEqual(counterA.getAppStatus(), {
                counterA: { count: 0 },
                counterB: { count: 0 },
                counterC: { count: 0 }
            });

            assert.deepEqual(this.counter.getAppStatus(), { counter: { count: 0 } });
        });
    });


    describe('#setState', function() {
        it('update state', function() {
            assert.deepEqual(this.counter.state, { count: 0 });
            this.counter.setState({ count: 1 });
            assert.deepEqual(this.counter.state, { count: 1 });
        });

        it('update state when multi args', function() {
            assert.deepEqual(this.counter.state, { count: 0 });
            this.counter.setState({ count: 1 }, undefined, null, { count: 5 });
            assert.deepEqual(this.counter.state, { count: 5 });
        });
    });


    describe('#trigger', function() {
        it('trigger shared action on ActionEmitter', function() {
            const spy = sinon.spy();
            emitter.register('$shared', spy);
            this.counter.trigger('$shared.clear', 0);
            assert(spy.calledWithExactly('clear', 0));
        });
    });


    describe('#forceUpdate', function() {
        /* transfer actions ./actions.test.js */
    });


    describe('#prevent', function() {
        it('should throw Prevent as Error', function() {
            assert.throws(() => {
                this.counter.prevent();
            }, /Prevent/);
        });
    });
});
