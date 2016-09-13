import assert from 'power-assert';
import merge from 'lodash.merge';
import cloneDeep from 'lodash.clonedeep';
import isFunction from 'lodash.isfunction';
import { store, dispatch, Squad, SharedAction } from './../../src/index.js';
import dispatcher from './../../src/lib/StateDispatcher.js';
import emitter from './../../src/lib/ActionEmitter.js';
import { counterSrc, sharedSrc } from './../fixtures.js';

describe('Squad', function() {
    beforeEach(function() {
        this.counterSrc = cloneDeep(counterSrc);
        this.sharedSrc = cloneDeep(sharedSrc);
        this.shared = new SharedAction(this.sharedSrc);
        this.counter = new Squad(this.counterSrc);
        this.store = store({ squads: [this.counter], shareds: [this.shared] });
    });

    afterEach(function() {
        emitter._clear();
        dispatcher._clear();
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
            expect.forEach(exp => {
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


        it('add handler and listener to ActionEmitter', function() {
            assert.deepEqual(Object.keys(emitter.handlers), ['counter']);
            assert.deepEqual(Object.keys(emitter.listeners), ['shared.clear']);
            assert(isFunction(emitter.handlers.counter));
            assert(isFunction(emitter.listeners['shared.clear'][0]));
        });
    });


    describe('#setState', function() {
        it('update state', function() {
            assert.deepEqual(this.counter.state, { count: 0 });
            this.counter.setState({ count: 1 });
            assert.deepEqual(this.counter.state, { count: 1 });
        });
    });


    describe('#trigger', function() {
        it('trigger shared action on ActionEmitter', function() {
            emitter.register('$shared', function(action, value) {
                assert.equal(action, 'clear');
                assert.equal(value, 0);
            });

            this.counter.trigger('$shared.clear', 0);
        });
    });


    describe('#forceUpdate', function() {
        beforeEach(function() {
            this.store = store({ squads: [this.counter] });
        });

        context('when pass action', function() {
            specify('state is dispatched and publish event', function() {
                emitter.on('counter.action', (event, state) => {
                    assert.equal(event, 'counter.action');
                    assert.deepEqual(state, { count: 0 });
                });

                this.store.onChange((state) => {
                    assert.deepEqual(state, { counter: { count: 0 } });
                });

                this.counter.forceUpdate('action');
            });
        });

        context('when dont pass action', function() { /* transfer actions option of Squad */ });
    });


    describe('#prevent', function() {
        it('should throw Prevent as Error', function() {
            assert.throws(() => {
                this.counter.prevent();
            }, /Prevent/);
        });
    });


    describe('actions option', function() {
        context('when return nextState', function() {
            it('update state', function() {
                assert.deepStrictEqual(this.store.getState(), { counter: { count: 0 } });
                dispatch('counter.up');
                assert.deepStrictEqual(this.store.getState(), { counter: { count: 1 } });
            });

            it('should be dispatched state', function() {
                this.store.onChange((next) =>
                    assert.deepStrictEqual(next, { counter: { count: 1 } }));
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

                dispatch('$counter.up');
                assert.deepEqual($counter.state, { count: 1 });

                const $store = store({ squads: [$counter], sharedActions: [$shared] });
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

                this.store = store({ squads: [this.$counter] });
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

                    this.store = store({ squads: [this.$counter] });
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

                    this.store = store({ squads: [this.$counter] });
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

                this.store = store({ squads: [this.$counter] });
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


        describe('async processing', function() {
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

                this.store = store({ squads: [this.$counter] });
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
                        assert.deepEqual(this.store.getState(), { $counter: { count: 0 } });
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
    });


    describe('subscribe option', function() {
        beforeEach(function() {
            this.counter = new Squad(merge(this.counterSrc, {
                context: '$counter',
                actions: {
                    clear() {
                        this.trigger('shared.asyncClear');
                    }
                },
                subscribe: {
                    'shared.asyncClear': function(num) {
                        return { count: num };
                    }
                }
            }));

            this.store = store({ squads: [this.counter] });
        });

        it('can listen other Squad action', function() {
            const counterB = new Squad(merge(this.counterSrc, {
                context: 'counterB',
                subscribe: {
                    'counter.up': function({ count }) {
                        return { count: count + 1 };
                    }
                }
            }));

            assert.deepEqual(counterB.state, { count: 0 });
            dispatch('counter.up');
            assert.deepEqual(counterB.state, { count: 2 });
        });


        it('can listen SharedAction', function() {
            dispatch('$counter.up');
            dispatch('$counter.up');
            assert.deepEqual(this.counter.state, { count: 2 });
            dispatch('$counter.clear');
            this.store.onChange(state => {
                assert.deepEqual(state, { $counter: { count: 0 } });
            });
        });
    });

    describe('hooks', function() {
        it('emit hooks when around action is emitting', function() {
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

            store({ squads: [counter] });

            dispatch('$counter.up', 10);
            assert.deepEqual(hookResult, [
                { beforeEach: { up: 10 } },
                { before: 10 },
                { afterEach: { up: { count: 10 } } },
                { after: { count: 10 } }
            ]);
        });
    });
});
