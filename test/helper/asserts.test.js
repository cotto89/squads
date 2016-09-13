import assert from 'power-assert';
import {
    hasContext,
    hasRegisteredHandler,
    refusePromise,
    hasAction,
    hasHandler
} from './../../src/helper/asserts.js';

describe('hasContext()', function() {
    it('shuold throw TypeError when context is not string', function() {
        assert.throws(function() {
            hasContext(undefined);
        }, /'context' is required/);
    });
});

describe('hasRegisteredHandler()', function() {
    it('should throw error when handler exist', function() {
        assert.throws(function() {
            hasRegisteredHandler('ctx', function h() {});
        }, /"ctx" handler is already exists/);
    });
});

describe('refusePromise()', function() {
    it('shuold throw RefusePromise when value is Promise', function() {
        assert.throws(function() {
            refusePromise('ctx.act', Promise.resolve(true));
        }, /RefusePromise/);
    });
});

describe('hasHandler', function() {
    it('throw ReferenceError when handler is notting', function() {
        assert.throws(function() {
            hasHandler('ctx.act', undefined);
        }, /ReferenceError/);
    });
});


describe('hasAction', function() {
    it('throw ReferenceError when action is notting', function() {
        assert.throws(function() {
            hasAction('ctx', 'act', undefined);
        }, /ReferenceError/);
    });
});
