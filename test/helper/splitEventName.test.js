import assert from 'power-assert';
import splitEventName from './../../src/helper/splitEventName.js';

describe('splitEventName()', function() {
    it('shold return context and action from event', function() {
        const event = 'context.subcontext.action';
        const { context, action } = splitEventName(event);
        assert.equal(context, 'context.subcontext');
        assert.equal(action, 'action');
    });
});
