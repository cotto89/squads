/* eslint-disable no-new */
import assert from 'power-assert';
import merge from 'lodash.merge';
import cloneDeep from 'lodash.clonedeep';
import { Store, dispatch, Squad, SharedAction } from './../../src/index.js';
import dispatcher from './../../src/lib/StatusDispatcher.js';
import emitter from './../../src/lib/ActionEmitter.js';
import { counterSrc, sharedSrc } from './../fixtures.js';

describe('Squad actions', function() {
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

    context('when return nextState', function() {
        it('update state', function() {
            assert.deepStrictEqual(this.store.getStatus(), { counter: { count: 0 } });
            dispatch('counter.up');
            assert.deepStrictEqual(this.store.getStatus(), { counter: { count: 1 } });
        });

        it('should be dispatched state', function() {
            this.store.onChange((next) => {
                assert.deepStrictEqual(next, { counter: { count: 1 } });
            });
            dispatch('counter.up');
        });

        it('shuold be published event', function() {
            emitter.on('counter.up', (ev, val) => {
                assert.equal(ev, 'counter.up');
                assert.deepEqual(val, { count: 1 });
            });
            dispatch('counter.up');
        });
    });


    context('when trigger SharedAction', function() {
        it('responce listener on subscribe', function() {
            let called = false;
            const $shared = new SharedAction({
                context: '$shared',
                clear() {
                    called = true;
                    return 0;
                }
            });

            const $counter = new Squad(merge(this.counterSrc, {
                context: '$counter',
                actions: {
                    clear() { this.trigger('$shared.clear'); }
                },
                subscribe: {
                    '$shared.clear': function(count) {
                        assert.equal(count, 0);
                        return { count };
                    }
                }
            }));

            const $store = new Store({ squads: [$counter], sharedActions: [$shared] });

            dispatch('$counter.up');
            assert.deepEqual($counter.state, { count: 1 });

            $store.onChange((next) => {
                assert.deepEqual(next, { $counter: { count: 0 } });
                assert.equal(called, true);
            });

            dispatch('$counter.clear');
        });
    });


    context('when use #setState() on manual', function() {
        beforeEach(function() {
            this.called = false;
            this.$counter = new Squad(merge(this.counterSrc, {
                context: '$counter',
                actions: {
                    upByManual() { this.setState({ count: 1 }); }
                }
            }));

            emitter.on('$counter.upByManual', () => {
                this.called = true;
            });

            this.store = new Store({ squads: [this.$counter] });
        });

        it('update state', function() {
            dispatch('$counter.upByManual');
            assert.deepEqual(this.$counter.state, { count: 1 });
        });

        it('shuold not be published event', function() {
            dispatch('$counter.upByManual');
            assert.equal(this.called, false);
        });

        it('should not be dispatched state', function() {
            dispatch('$counter.upByManual');
            let called = false;
            this.store.onChange(() => { called = true; });
            assert.equal(called, false);
        });
    });


    context('when use #setState() and #forceUpdate() on manual', function() {
        context('when passed actionName to forceUpdate', function() {
            beforeEach(function() {
                this.called = false;
                this.$counter = new Squad(merge(this.counterSrc, {
                    context: '$counter',
                    actions: {
                        upByManualandForceUpdate() {
                            this.setState({ count: 1 });
                            this.forceUpdate('upByManualandForceUpdate');
                        }
                    }
                }));

                emitter.on('$counter.upByManualandForceUpdate', () => {
                    this.called = true;
                });

                this.store = new Store({ squads: [this.$counter] });
            });

            it('update state', function() {
                dispatch('$counter.upByManualandForceUpdate');
                assert.deepEqual(this.$counter.state, { count: 1 });
            });

            it('shuold be published event', function() {
                dispatch('$counter.upByManualandForceUpdate');
                assert.equal(this.called, true);
            });

            it('should be dispatched state', function() {
                let called = false;
                this.store.onChange((next) => {
                    called = true;
                    assert.deepEqual(next, { $counter: { count: 1 } });
                });
                dispatch('$counter.upByManualandForceUpdate');
                assert.equal(called, true);
            });
        });


        context('when not passed actionName to forceUpdate', function() {
            beforeEach(function() {
                this.called = false;
                this.$counter = new Squad(merge(this.counterSrc, {
                    context: '$counter',
                    actions: {
                        upByManualandForceUpdate() {
                            this.setState({ count: 1 });
                            this.forceUpdate();
                        }
                    }
                }));

                emitter.on('$counter.upByManualandForceUpdate', () => {
                    this.called = true;
                });

                this.store = new Store({ squads: [this.$counter] });
            });

            it('update state', function() {
                dispatch('$counter.upByManualandForceUpdate');
                assert.deepEqual(this.$counter.state, { count: 1 });
            });

            it('shuold not be published event', function() {
                dispatch('$counter.upByManualandForceUpdate');
                assert.equal(this.called, false);
            });

            it('should be dispatched state', function() {
                let called = false;
                this.store.onChange((next) => {
                    called = true;
                    assert.deepEqual(next, { $counter: { count: 1 } });
                });
                dispatch('$counter.upByManualandForceUpdate');
                assert.equal(called, true);
            });
        });
    });


    context('when called #prevent()', function() {
        beforeEach(function() {
            this.called = false;
            this.$counter = new Squad(merge(this.counterSrc, {
                context: '$counter',
                actions: {
                    preventUp() {
                        this.prevent();
                        return { count: this.state.count + 1 };
                    }
                }
            }));

            emitter.on('$counter.preventUp', () => {
                this.called = true;
            });

            this.store = new Store({ squads: [this.$counter] });
        });


        it('shuold not update state', function() {
            this.store.onChange((next) => {
                assert.deepEqual(next, { count: 0 });
            });

            dispatch('$counter.preventUp');
        });

        it('shuold not be published event', function() {
            dispatch('$counter.preventUp');
            assert.equal(this.called, false);
        });

        it('shuold not be dispatched state', function() {
            let called = false;
            this.store.onChange(() => { called = true; });

            dispatch('$counter.preventUp');
            assert.equal(called, false);
        });
    });
});
