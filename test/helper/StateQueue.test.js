import assert from 'power-assert';
import StateQueue from './../../src/helper/StateQueue.js';

describe('StateQueue', function() {
    beforeEach(function() {
        const event = 'context.action';
        this.queue = new StateQueue(event);
    });

    describe('#constructor', function() {
        specify('default props', function() {
            assert(Object.keys(this.queue).includes('status', 'event'));
            const { event, status } = this.queue;
            assert.equal(event, 'context.action');
            assert.deepEqual(status, []);
        });
    });

    describe('get stateCount', function() {
        it('return state count', function() {
            assert.equal(this.queue.stateCount, 0);
            this.queue.push({});
            assert.equal(this.queue.stateCount, 1);
        });
    });


    describe('#push', function() {
        it('should throw RefusePromise when push Promise', function() {
            assert.throws(() => {
                this.queue.push(Promise.resolve());
            }, /RefusePromise/);
        });

        it('should add state and return state', function() {
            const status = this.queue.push({});
            assert.deepEqual(this.queue.status, [{}]);
            assert.deepEqual(status, [{}]);
        });
    });
});
