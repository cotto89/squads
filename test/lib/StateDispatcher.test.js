import assert from 'power-assert';
import StatusDispatcher from './../../src/lib/StatusDispatcher.js';

describe('StatusDispatcher', function() {
    beforeEach(function() {
        this.dispatcher = new StatusDispatcher();
    });

    describe('#dispatchStatus', function() {
        const context = 'counter';
        const state = { count: 0 };

        it('should dispatch state', function() {
            this.dispatcher.on('state:change', (nextState) => {
                assert.deepStrictEqual(nextState, {
                    counter: { count: 0 }
                });
            });

            this.dispatcher.dispatchStatus(context, state);
        });
    });
});
