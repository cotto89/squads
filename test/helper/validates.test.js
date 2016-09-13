import assert from 'power-assert';
import {
    validateContext,
    hasRegisteredHandler,
    refusePromise,
    validateActionExistence,
    validateHandlerExistence
} from './../../src/helper/validates.js';

describe('validateContext()', function() {
    it('shuold throw TypeError when context is not string', function() {
        assert.throws(function() {
            validateContext(undefined);
        }, /'context' is required/);
    });

    it('shuold return true when context is string', function() {
        assert.equal(validateContext('context'), true);
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

describe('validateHandlerExistence', function() {
    it('throw ReferenceError when handler is notting', function() {
        assert.throws(function() {
            validateHandlerExistence('ctx.act', undefined);
        }, /ReferenceError/);
    });
});


describe('validateActionExistence', function() {
    it('throw ReferenceError when action is notting', function() {
        assert.throws(function() {
            validateActionExistence('ctx', 'act', undefined);
        }, /ReferenceError/);
    });
});
