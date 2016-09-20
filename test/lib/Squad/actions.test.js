/* eslint-disable no-new */
import assert from 'power-assert';
import sinon from 'sinon';
import merge from 'lodash.merge';
import cloneDeep from 'lodash.clonedeep';
import { Store, dispatch, Squad, SharedAction } from './../../../src/index.js';
import emitter from './../../../src/lib/ActionEmitter.js';
import { counterSrc, sharedSrc } from '.././../fixtures.js';

describe('Squad actions', function() {
    beforeEach(function() {
        this.counterSrc = cloneDeep(counterSrc);
        this.sharedSrc = cloneDeep(sharedSrc);
        this.shared = new SharedAction(this.sharedSrc);
        this.counter = new Squad(this.counterSrc);
        this.store = new Store({ squads: [this.counter], sharedActions: [this.shared] });
        this.spy = sinon.spy();
    });

    afterEach(function() {
        emitter._clear();
        this.store.dispatcher._clear();
        this.spy.reset();
    });

    context('when return nextState', function() {
        it('update state', function() {
            assert.deepStrictEqual(this.store.getStatus(), { counter: { count: 0 } });
            dispatch('counter.up');
            assert.deepStrictEqual(this.store.getStatus(), { counter: { count: 1 } });
        });

        it('should be dispatched state', function() {
            this.store.onChange(this.spy);
            dispatch('counter.up');

            assert(this.spy.calledWith({ counter: { count: 1 } }));
        });

        it('shuold be published event', function() {
            emitter.on('counter.up', this.spy);
            dispatch('counter.up');
            assert(this.spy.calledWith('counter.up', { count: 1 }));
        });
    });


    context('when trigger SharedAction', function() {
        it('responce listener on subscribe', function(done) {
            dispatch('counter.up');
            assert.deepEqual(this.counter.state, { count: 1 });

            this.store.onChange(this.spy);
            dispatch('counter.clear');

            setTimeout(() => {
                assert(this.spy.calledWith({ counter: { count: 0 } }));
                done();
            });
        });
    });


    context('when use #setState() on manual', function() {
        beforeEach(function() {
            this.$counter = new Squad(merge(this.counterSrc, {
                context: '$counter',
                actions: {
                    upByManual() { this.setState({ count: 1 }); }
                }
            }));

            emitter.on('$counter.upByManual', this.spy);
            this.store = new Store({ squads: [this.$counter] });
        });

        it('update state', function() {
            dispatch('$counter.upByManual');
            assert.deepEqual(this.$counter.state, { count: 1 });
        });

        it('shuold not be published event', function() {
            dispatch('$counter.upByManual');
            assert.equal(this.spy.called, false);
        });

        it('should not be dispatched state', function() {
            dispatch('$counter.upByManual');
            const spy = sinon.spy();
            this.store.onChange(spy);
            assert.equal(spy.called, false);
        });
    });


    context('when use #setState() and #forceUpdate() on manual', function() {
        context('when passed actionName to forceUpdate', function() {
            beforeEach(function() {
                this.$counter = new Squad(merge(this.counterSrc, {
                    context: '$counter',
                    actions: {
                        upByManualandForceUpdate() {
                            this.setState({ count: 1 });
                            this.forceUpdate('upByManualandForceUpdate');
                        }
                    }
                }));

                emitter.on('$counter.upByManualandForceUpdate', this.spy);
                this.store = new Store({ squads: [this.$counter] });
            });

            it('update state', function() {
                dispatch('$counter.upByManualandForceUpdate');
                assert.deepEqual(this.$counter.state, { count: 1 });
            });

            it('shuold be published event', function() {
                dispatch('$counter.upByManualandForceUpdate', 10);
                assert(this.spy.calledWithExactly('$counter.upByManualandForceUpdate', { count: 1 }));
            });

            it('should be dispatched state', function() {
                const spy = sinon.spy();
                this.store.onChange(spy);
                dispatch('$counter.upByManualandForceUpdate');
                assert(spy.calledWithExactly({ $counter: { count: 1 } }));
            });
        });


        context('when not passed actionName to forceUpdate', function() {
            beforeEach(function() {
                this.$counter = new Squad(merge(this.counterSrc, {
                    context: '$counter',
                    actions: {
                        upByManualandForceUpdate() {
                            this.setState({ count: 1 });
                            this.forceUpdate();
                        }
                    }
                }));

                emitter.on('$counter.upByManualandForceUpdate', this.spy);
                this.store = new Store({ squads: [this.$counter] });
            });

            it('update state', function() {
                dispatch('$counter.upByManualandForceUpdate');
                assert.deepEqual(this.$counter.state, { count: 1 });
            });

            it('shuold not be published event', function() {
                dispatch('$counter.upByManualandForceUpdate');
                assert.equal(this.spy.called, false);
            });

            it('should be dispatched state', function() {
                const spy = sinon.spy();
                this.store.onChange(spy);
                dispatch('$counter.upByManualandForceUpdate');
                assert(spy.calledWithExactly({ $counter: { count: 1 } }));
            });
        });
    });


    context('when called #prevent()', function() {
        beforeEach(function() {
            this.$counter = new Squad(merge(this.counterSrc, {
                context: '$counter',
                actions: {
                    preventUp() {
                        this.prevent();
                        return { count: this.state.count + 1 };
                    }
                }
            }));

            emitter.on('$counter.preventUp', this.spy);
            this.store = new Store({ squads: [this.$counter] });
        });


        it('shuold not update state', function() {
            dispatch('$counter.preventUp');
            assert.deepEqual(this.$counter.state, { count: 0 });
        });

        it('shuold not be published event', function() {
            dispatch('$counter.preventUp');
            assert.equal(this.spy.called, false);
        });

        it('shuold not be dispatched state', function() {
            const spy = sinon.spy();
            this.store.onChange(spy);
            dispatch('$counter.preventUp');
            assert.equal(spy.called, false);
        });
    });
});
