import assert from 'power-assert';
import { StateDispatcher } from './../../src/lib/StateDispatcher.js';

describe('StateDispatcher', function() {
    beforeEach(function() {
        this.dispatcher = new StateDispatcher();
    });

    describe('#dispatchState', function() {
        const context = 'counter';
        const state = { count: 0 };

        it('should dispatch state', function() {
            this.dispatcher.on('state:change', (nextState) => {
                assert.deepStrictEqual(nextState, {
                    counter: { count: 0 }
                });
            });

            this.dispatcher.dispatchState(context, state);
        });
    });
});
