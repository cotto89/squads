/* eslint-disable no-new */
import assert from 'power-assert';
import merge from 'lodash.merge';
import cloneDeep from 'lodash.clonedeep';
import { Store, dispatch, Squad, SharedAction } from './../../src/index.js';
import dispatcher from './../../src/lib/StatusDispatcher.js';
import emitter from './../../src/lib/ActionEmitter.js';
import { counterSrc, sharedSrc } from './../fixtures.js';

describe('Squad async processing', function() {
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

    beforeEach(function() {
        this.$counter = new Squad(merge(this.counterSrc, {
            context: '$counter',
            actions: {
                invalidAsyncUp() {
                    return Promise.resolve({ count: 1 });
                },
                asyncUpByManual() {
                    Promise.resolve(this.setState({ count: 1 }));
                },
                asyncUpByManualAndForce() {
                    Promise.resolve()
                        .then(() => this.setState({ count: 1 }))
                        .then(() => this.forceUpdate('asyncUpByManualAndForce'));
                },
                clearAsync() {
                    this.trigger('shared.clearAsync');
                }
            },
            subscribe: {
                'shared.clearAsync': function(num) {
                    return { count: num };
                }
            }
        }));

        this.store = new Store({ squads: [this.$counter] });
    });

    context('when return Promise', function() {
        it('throw RefusePromise', function() {
            emitter.on('$error', (event, err) => {
                assert.equal(event, '$error');
                assert.equal(err.name, 'RefusePromise');
            });

            dispatch('$counter.invalidAsyncUp');
        });

        it('should not be updated state', function() {
            emitter.on('$error', () => {
                assert.deepEqual(this.store.getState('$counter'), { count: 0 });
            });

            dispatch('$counter.invalidAsyncUp');
        });

        it('should not be published event', function() {
            let called = false;

            emitter.on('$error', () => { assert.equal(called, false); });
            emitter.on('$counter.invalidAsyncUp', () => { called = true; });

            dispatch('$counter.invalidAsyncUp');
        });

        it('shuold not be dispacthed state', function() {
            let called = false;

            emitter.on('$error', () => { assert.equal(called, false); });
            this.store.onChange(() => { called = true; });

            dispatch('$counter.invalidAsyncUp');
        });
    });


    context('when use #setState() on manual', function() {
        it('should be updated state', function(done) {
            assert.deepEqual(this.$counter.state, { count: 0 });
            dispatch('$counter.asyncUpByManual');
            setTimeout(() => {
                assert.deepEqual(this.$counter.state, { count: 1 });
                done();
            }, 0);
        });
    });


    context('when use #setState() and #forceUpdate() on manual', function() {
        it('should be updated state', function(done) {
            assert.deepEqual(this.$counter.state, { count: 0 });
            dispatch('$counter.asyncUpByManualAndForce');
            setTimeout(() => {
                assert.deepEqual(this.$counter.state, { count: 1 });
                done();
            }, 0);
        });

        it('shuold be published event', function() {
            emitter.on('$counter.asyncUpByManualAndForce', (event, state) => {
                assert.equal(event, '$counter.asyncUpByManualAndForce');
                assert.deepEqual(state, { count: 1 });
            });
            dispatch('$counter.asyncUpByManualAndForce');
        });

        it('should be dispatched state', function() {
            this.store.onChange(state => {
                assert.deepEqual(state, { $counter: { count: 1 } });
            });
            dispatch('$counter.asyncUpByManualAndForce');
        });
    });
});
