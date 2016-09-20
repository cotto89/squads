import assert from 'power-assert';
import sinon from 'sinon';
import StatusDispatcher from './../../src/lib/StatusDispatcher.js';

describe('StatusDispatcher', function() {
    beforeEach(function() {
        this.dispatcher = new StatusDispatcher();
    });

    describe('request', function() {
        it('shuold return response', function() {
            this.dispatcher.onRequest('demo', () => ({ count: 0 }));
            const res = this.dispatcher.request('demo');
            assert.deepStrictEqual(res, { count: 0 });
        });
    });

    describe('onRequest', function() {
        it('register handler in _messages prop', function() {
            const handler = () => {};
            this.dispatcher.onRequest('demo', handler);
            assert.deepStrictEqual(this.dispatcher._messages, {
                demo: handler
            });
        });
    });


    describe('#dispatchStatus', function() {
        it('should dispatch state', function() {
            const context = 'counter';
            const state = { count: 0 };
            const spy = sinon.spy();
            this.dispatcher.on('state:change', spy);
            this.dispatcher.dispatchStatus(context, state);
            assert(spy.calledWith({ counter: { count: 0 } }));
        });
    });
});
