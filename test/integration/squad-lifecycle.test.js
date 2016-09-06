import assert from 'power-assert';
import { build, dispatch, Squad } from './../../src/index.js';
import { emitter, dispatcher } from './../../src/lib/build.js';

describe('squad lifecycle', function() {
    afterEach(function() {
        dispatcher._clear();
        emitter._clear();
    });

    it('should', function() {
        const counter = new Squad({
            context: 'counter',
            state: { count: 0 },
            before: {
                up(num) {
                    assert.equal(num, 10);
                }
            },
            after: {
                up(result) {
                    assert.deepEqual(result, { count: 10 });
                },

                preventUp({ count }) {
                    if (!(typeof count === 'number')) {
                        this.prevent();
                    }
                }
            },
            beforeEach() {
                assert(true);
            },
            afterEach() {
                assert(true);
            },
            actions: {
                up(num = 1) {
                    return { count: num };
                },
                preventUp(num = 1) {
                    return { count: num };
                }
            }
        });

        build({
            squads: [counter]
        });

        dispatch({ 'counter.up': 10 });
        assert.deepEqual(counter.state, { count: 10 });
        dispatch({ 'counter.preventUp': 'val' });
        assert.deepEqual(counter.state, { count: 10 });
    });
});
