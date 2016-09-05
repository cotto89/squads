import assert from 'power-assert';
import Squad from './../../src/lib/Squad.js';

/*
Squad.extendはdefaultsが書き換えられてしまい、他のtestに影響がでるため、
動作確認だけしてテストを書いていない。defaultsを参照する以外の実装を思いつきたい。

Squad#__connect__は依存あるのでintegration testで
handlerの登録と挙動を確認する
*/

describe('Squad', function() {
    describe('#constructor', function() {
        const counterMixin = {
            state: { count: 10 },
            actions: {
                clear() { this.setState({ count: 0 }); }
            }
        };

        beforeEach(function() {
            this.squad = new Squad({
                context: 'counter',
                state: { count: 0 },
                mixins: [counterMixin],
                actions: {
                    up() { this.setState({ count: this.state.count + 1 }); },
                    down() { this.setState({ count: this.state.count - 1 }); }
                },
                subscribe: {
                    'demo.foo': function() {},
                    'demo.bar': function() {}
                },
                extra: {
                    up10() {
                        this.setState({ count: this.state.count * 10 });
                    }
                }
            });
        });


        it('shuold create Squad instance', function() {
            assert(this.squad instanceof Squad);
        });

        it('should have state and is ignored mixin state prop', function() {
            assert.deepEqual(this.squad.state, { count: 0 });
        });

        it('mixin and bound this on functionaly props', function() {
            assert.deepEqual(this.squad.state, { count: 0 });

            for (let i = 0; i < 2; i++) {
                this.squad.actions.up();
            }

            assert.deepEqual(this.squad.state, { count: 2 });

            this.squad.actions.down();
            assert.deepEqual(this.squad.state, { count: 1 });

            this.squad.extra.up10();
            assert.deepEqual(this.squad.state, { count: 10 });

            this.squad.actions.clear();
            assert.deepEqual(this.squad.state, { count: 0 });
        });
    });


    describe('setState', function() {
        beforeEach(function() {
            this.squad = new Squad({
                context: 'counter',
                state: { count: 0 }
            });
        });

        it('shuold set nextState', function() {
            const nextState = this.squad.setState({ count: 10 });
            assert.deepEqual(this.squad.state, { count: 10 });
            assert.deepEqual(nextState, { count: 10 });
        });
    });
});
