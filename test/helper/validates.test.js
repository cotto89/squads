import assert from 'power-assert';
import { validateContext } from './../../src/helper/validates.js';

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
