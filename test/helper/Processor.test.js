import assert from 'power-assert';
import Processor from './../../src/helper/Processor.js';

describe('Processor', function() {
    beforeEach(function() {
        const event = 'context.action';
        this.processor = new Processor(event);
    });

    describe('#constructor', function() {
        specify('default props', function() {
            assert(Object.keys(this.processor).includes('state', 'event'));
            const { event, state } = this.processor;
            assert.equal(event, 'context.action');
            assert.deepEqual(state, []);
        });
    });

    describe('get stateCount', function() {
        it('return state count', function() {
            assert.equal(this.processor.stateCount, 0);
            this.processor.pushState({});
            assert.equal(this.processor.stateCount, 1);
        });
    });


    describe('#pushState', function() {
        it('should throw RefusePromise when push Promise', function() {
            assert.throws(() => {
                this.processor.pushState(Promise.resolve());
            }, /RefusePromise/);
        });

        it('should add state and return state', function() {
            const state = this.processor.pushState({});
            assert.deepEqual(this.processor.state, [{}]);
            assert.deepEqual(state, [{}]);
        });
    });
});
