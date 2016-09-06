import assert from 'power-assert';
import { build, dispatch, Squad, SharedAction } from './../../src/index.js';
import { emitter, dispatcher } from './../../src/lib/build.js';

describe('Integration', function() {
    beforeEach(function() {
        /* SharedAction */
        this.shared = new SharedAction({
            context: 'shared',
            clear() {
                return Promise.resolve(0);
            }
        });

        /* Mixin */
        const counterMixin = {
            actions: {
                up10() {
                    const state = this.state.count > 0 ? this.state.count : 1;
                    return { count: state * 10 };
                },
                upX(x) {
                    return { count: x };
                }
            },
            subscribe: {
                'resetter.reset': function() {
                    return { count: 0 };
                }
            }
        };

        /* Squad */
        this.counter = new Squad({
            context: 'counter',
            state: { count: 0 },
            mixins: [counterMixin],
            actions: {
                up() {
                    return { count: this.state.count + 1 };
                },
                down() {
                    return { count: this.state.count - 1 };
                },
                // invalid action
                asyncUp() {
                    return Promise.resolve({ count: this.state.count + 1 });
                },
                noDispatchUp() {
                    this.setState({ count: 1000 });
                },
                clear() {
                    this.trigger('shared.clear');
                },
                force(num) {
                    Promise.resolve(num)
                        .then(this.setState({ count: num }))
                        .then(this.forceUpdate('force'));
                }
            },
            subscribe: {
                'shared.clear': function(count) {
                    return { count };
                }

            }
        });

        this.resetter = new Squad({
            context: 'resetter',
            state: { resetCount: 0 },
            actions: {
                reset() {
                    return { resetCount: this.state.resetCount + 1 };
                }
            }
        });

        this.app = build({
            squads: [this.counter, this.resetter],
            sharedActions: [this.shared]
        });
    });

    afterEach(function() {
        dispatcher._clear();
        emitter._clear();
    });

    it('debug', function() {
        // console.log({ app: this.app });
        // console.log({ counter: this.counter });
        // console.log({ resetter: this.resetter });
        // console.log({ shared: this.shared })
        // console.log(emitter);
        //     console.log(dispatcher);
    });

    describe('Squad#forceUpdate', function() {
        it('shuold change state', function() {
            this.app.onChange(next => {
                assert.deepEqual(next, {
                    counter: { count: 100 }
                });
            });

            dispatch({ 'counter.force': 100 });
        });
    });


    describe('SharedAction', function() {
        it('should be {count: 0} on counte state', function() {
            this.app.onChange(next => {
                assert.deepEqual(next, {
                    counter: { count: 0 }
                });
            });

            dispatch('counter.clear');
        });
    });


    describe('build().getState()', function() {
        it('should return squads state in the form of { context: {state}... }', function() {
            const state = this.app.getState();
            assert.deepEqual(state, {
                counter: { count: 0 },
                resetter: { resetCount: 0 }
            });
        });
    });

    describe('dispatch()', function() {
        it('shuold change counter state by build().dispatch()', function() {
            this.app.onChange((nextState) => {
                assert.deepEqual(nextState, {
                    counter: { count: 1 }
                });
            });

            this.app.dispatch('counter.up');
        });

        it('shuold change counter state by global dispatch()', function() {
            this.app.onChange((nextState) => {
                assert.deepEqual(nextState, {
                    counter: { count: -1 }
                });
            });

            dispatch('counter.down');
        });

        it('should change counter state by mixin action', function() {
            this.app.onChange(nextState => {
                assert.deepEqual(nextState, { counter: { count: 10 } });
            });

            this.app.dispatch([{ 'counter.up10': null }]);
        });

        it('shuld change counter state by value ', function() {
            this.app.onChange(nextState => {
                assert.deepEqual(nextState, {
                    counter: { count: 100 }
                });
            });

            this.app.dispatch([{ 'counter.upX': 100 }]);
        });

        it('shuld not change state when action return Promise', function() {
            let called = false;
            this.app.onChange(() => {
                called = true;
            });

            dispatch('counter.asyncUp');
            assert.equal(called, false);
        });

        it('should only change counte state when use this.setState', function() {
            let called = false;
            this.app.onChange(() => {
                called = true;
            });

            assert.deepEqual(this.counter.state, { count: 0 });

            dispatch('counter.noDispatchUp');
            assert.equal(called, false);
            assert.deepEqual(this.counter.state, { count: 1000 });
        });
    });

    describe('subscribe', function() {
        it('shuold emit listener when emit resetter.reset', function() {
            let called = 0;
            this.app.onChange((nextState) => {
                called++;

                if (called === 1) {
                    assert.deepEqual(nextState, { counter: { count: 1 } });
                }

                if (called === 2) {
                    assert.deepEqual(nextState, { resetter: { resetCount: 1 } });
                }

                // listener
                if (called === 3) {
                    assert.deepEqual(nextState, { counter: { count: 0 } });
                }
            });

            dispatch('counter.up');
            dispatch('resetter.reset'); // emit 'resetter.rest' and listener
        });
    });
});
