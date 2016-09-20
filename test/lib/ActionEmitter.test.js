import assert from 'power-assert';
import sinon from 'sinon';
import { ActionEmitter } from './../../src/lib/ActionEmitter.js';

describe('ActionEmitter', function() {
    const cb = () => {};
    beforeEach(function() {
        this.emitter = new ActionEmitter();
    });

    describe('#on', function() {
        it('should add action listener', function() {
            this.emitter.on('ctx.act', cb);
            assert.deepEqual(this.emitter.listeners, { 'ctx.act': [cb] });
        });
    });


    describe('#publish', function() {
        it('should emit listener func', function() {
            const spyA = sinon.spy();
            const spyB = sinon.spy();

            this.emitter.on('ctx.listen', spyA);
            this.emitter.on('ctx.listen', spyB);
            this.emitter.publish('ctx.listen', 'val');

            assert(spyA.calledWithExactly('ctx.listen', 'val'));
            assert(spyB.calledWithExactly('ctx.listen', 'val'));
        });
    });

    describe('#onDispatch', function() {
        it('should add ActionHandler to this.handlers', function() {
            this.emitter.onDispatch('ctx', cb);
            assert.deepEqual(this.emitter.handlers, { ctx: cb });
        });

        it('should throw Error when already registered', function() {
            assert.throws(() => {
                this.emitter.onDispatch('ctx', cb);
                this.emitter.onDispatch('ctx', cb);
            }, /"ctx" handler is already exists/);
        });
    });


    describe('#dispatch', function() {
        it('should emit target handler', function() {
            const spyA = sinon.spy();
            const spyB = sinon.spy();
            const payload = { 'ctx.act': 100, 'ctx2.sub.act': 1000 };

            this.emitter.onDispatch('ctx', spyA);
            this.emitter.onDispatch('ctx2.sub', spyB);

            this.emitter.dispatch(payload);
            assert(spyA.calledWithExactly('act', 100));
            assert(spyB.calledWithExactly('act', 1000));
        });
    });



    describe('#register', function() {
        it('should add ShardActionHandler to this.shared prop', function() {
            this.emitter.register('shared', cb);
            assert.deepEqual(this.emitter.shareds, { shared: cb });
        });

        it('should throw Error when already registered', function() {
            assert.throws(() => {
                this.emitter.register('shared', cb);
                this.emitter.register('shared', cb);
            }, /"shared" handler is already exists/);
        });
    });

    describe('#trigger', function() {
        it('shuold emit SharedAction', function() {
            const spy = sinon.spy();
            this.emitter.register('shared', spy);
            this.emitter.trigger('shared.action', 1);
            assert(spy.calledWithExactly('action', 1));
        });

        it('throw error when handler is notting', function() {
            assert.throws(function() {
                this.emitter.trigger('shared.action', 1);
            });
        });
    });
});
