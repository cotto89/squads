/* eslint-disable no-new */
import assert from 'power-assert';
import merge from 'lodash.merge';
import cloneDeep from 'lodash.clonedeep';
import sinon from 'sinon';
import { Store, dispatch, Squad, SharedAction } from './../../../src/index.js';
import emitter from './../../../src/lib/ActionEmitter.js';
import { counterSrc, sharedSrc } from './../../fixtures.js';

describe('Squad async processing', function() {
    beforeEach(function() {
        this.spy = sinon.spy();
        this.counterSrc = cloneDeep(counterSrc);
        this.sharedSrc = cloneDeep(sharedSrc);
        this.shared = new SharedAction(this.sharedSrc);
        this.counter = new Squad(merge(this.counterSrc, {
            actions: {
                invalidAsyncUp() {
                    return Promise.resolve({ count: 1 });
                },
                asyncUpByManual() {
                    Promise.resolve(this.setState({ count: 1 }));
                },
                asyncUpByManualAndForce(count = 1) {
                    Promise.resolve()
                        .then(() => {
                            this.setState({ count });
                            this.forceUpdate('asyncUpByManualAndForce');
                        });
                },
                asyncClear() {
                    this.trigger('shared.asyncClear');
                }
            },
            subscribe: {
                'shared.asyncClear': function(count) {
                    return { count };
                }
            }
        }));

        this.store = new Store({
            squads: [this.counter],
            sharedActions: [this.shared]
        });
    });

    afterEach(function() {
        emitter._clear();
        this.store.dispatcher._clear();
        this.spy.reset();
    });

    context('when return Promise', function() {
        it('throw RefusePromise', function(done) {
            emitter.on('$error', (event, err) => {
                this.spy();
                assert.equal(event, '$error');
                assert.equal(err.name, 'RefusePromise');
            });

            dispatch('counter.invalidAsyncUp');

            setTimeout(() => {
                assert(this.spy.called);
                done();
            });
        });

        it('should not be updated state', function(done) {
            emitter.on('$error', () => {
                this.spy();
                assert.deepEqual(this.store.getState('counter'), { count: 0 });
            });

            dispatch('counter.invalidAsyncUp');
            setTimeout(() => {
                assert(this.spy.called);
                done();
            });
        });
    });

    context('when trigger SharedAciton and subscribe event', function() {
        it('should be updated state', function(done) {
            this.store.onChange((status) => {
                this.spy();
                assert.deepEqual(status, { counter: { count: 0 } });
            });

            dispatch('counter.asyncClear');

            setTimeout(() => {
                assert(this.spy.called);
                done();
            });
        });
    });


    context('when use #setState() on manual', function() {
        it('should be updated state', function(done) {
            assert.deepEqual(this.counter.state, { count: 0 });
            dispatch('counter.asyncUpByManual');
            setTimeout(() => {
                assert.deepEqual(this.counter.state, { count: 1 });
                done();
            });
        });
    });


    context('when use #setState() and #forceUpdate() on manual', function() {
        it('should be updated state', function(done) {
            assert.deepEqual(this.counter.state, { count: 0 });
            dispatch('counter.asyncUpByManualAndForce');
            setTimeout(() => {
                assert.deepEqual(this.counter.state, { count: 1 });
                done();
            });
        });

        it('shuold be published event', function(done) {
            emitter.on('counter.asyncUpByManualAndForce', this.spy);
            dispatch('counter.asyncUpByManualAndForce', 10);

            setTimeout(() => {
                assert(this.spy.calledWith('counter.asyncUpByManualAndForce', { count: 10 }));
                done();
            });
        });

        it('should be dispatched state', function(done) {
            this.store.onChange(this.spy);
            dispatch('counter.asyncUpByManualAndForce', 10);
            setTimeout(() => {
                assert.deepEqual(this.counter.state, { count: 10 });
                assert(this.spy.calledWith({ counter: { count: 10 } }));
                done();
            });
        });
    });
});
