import assert from 'power-assert';
import mixin from './../../src/helper/mixin.js';

/* mock */
class Counter {
    constructor() {
        this.state = { count: 0 };
    }
}

const src = {
    state: { count: 100 },
    str: 'some text',

    setState(nextState) {
        this.state = Object.assign({}, this.state, nextState);
    },
    actions: {
        up() {
            this.setState({ count: this.state.count + 1 });
        },
        down() {
            this.setState({ count: this.state.count - 1 });
        },

        nest: {
            clear() {
                this.setState({ count: 0 });
            }
        }
    }
};


describe('mixin()', function() {
    beforeEach(function() {
        this.src = src;
        this.counter = new Counter();
    });

    it('merge deeply properties of counter and src', function() {
        const ret = mixin(this.counter, this.src, this.counter, ['state']);
        assert(ret instanceof Counter);
        assert(this.counter instanceof Counter);
        assert.deepStrictEqual(ret, this.counter);

        const { state, str, actions } = this.counter;
        assert(!!state);
        assert(!!str);
        assert(!!actions);
        assert(!!actions.up);
        assert(!!actions.down);
        assert(!!actions.nest);
        assert(!!actions.nest.clear);
    });

    it('ignore specific properties', function() {
        mixin(this.counter, this.src, this.counter, ['state']);
        assert.notDeepStrictEqual(this.counter.state, this.src.state);
        assert.deepStrictEqual(this.counter.state, { count: 0 });
    });

    it('is bound this when functional properties', function() {
        mixin(this.counter, this.src, this.counter, ['state']);

        this.counter.actions.up();
        assert.deepStrictEqual(this.counter.state, { count: 1 });

        for (let i = 0; i < 3; i++) {
            this.counter.actions.down();
        }
        assert.deepStrictEqual(this.counter.state, { count: -2 });

        this.counter.actions.nest.clear();
        assert.deepStrictEqual(this.counter.state, { count: 0 });
    });
});
