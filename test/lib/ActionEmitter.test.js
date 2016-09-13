import assert from 'power-assert';
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
            let calledCount = 0;
            const payload = { 'ctx.act': 100, 'ctx2.sub.act': 1000 };

            this.emitter.onDispatch('ctx', (action, value) => {
                calledCount++;
                assert.equal(action, 'act');
                assert.equal(value, 100);
            });

            this.emitter.onDispatch('ctx2.sub', (action, value) => {
                calledCount++;
                assert.equal(action, 'act');
                assert.equal(value, 1000);
            });

            this.emitter.dispatch(payload);
            assert.equal(calledCount, 2);
        });
    });


    describe('#publish', function() {
        it('should emit listener func', function() {
            let calledCount = 0;

            this.emitter.on('ctx.listen', (event, value) => {
                calledCount++;
                assert.equal(event, 'ctx.listen');
                assert.equal(value, 'val');
            });

            this.emitter.on('ctx.listen', (event, value) => {
                calledCount++;
                assert.equal(event, 'ctx.listen');
                assert.equal(value, 'val');
            });

            this.emitter.publish('ctx.listen', 'val');
            assert.equal(calledCount, 2);
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
            this.emitter.register('shared', (action, ...value) => {
                assert.equal(action, 'action');
                assert.equal(value, 1);
            });

            this.emitter.trigger('shared.action', 1);
        });

        it('throw error when handler is notting', function() {
            assert.throws(function() {
                this.emitter.trigger('shared.action', 1);
            });
        });
    });
});
