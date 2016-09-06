import assert from 'power-assert';
import formatPayloads from './../../src/helper/formatPayloads.js';

describe('formatPayloads()', function() {
    const p1 = 'ctx.act';
    const p2 = { 'ctx.act1': 1, 'ctx.act2': 'val' };
    const p3 = [{ 'ctx.act3': undefined }, { 'ctx.act4': null }];

    it('should retrun formated payload(s)', function() {
        const $p1A = formatPayloads(p1);
        const $p1B = formatPayloads(p1, 'val');
        const $p2 = formatPayloads(p2);
        const $p3 = formatPayloads(p3);

        assert.deepEqual($p1A, [{ 'ctx.act': null }]);
        assert.deepEqual($p1B, [{ 'ctx.act': 'val' }]);
        assert.deepEqual($p2, [{ 'ctx.act1': 1 }, { 'ctx.act2': 'val' }]);
        assert.deepEqual($p3, [{ 'ctx.act3': undefined }, { 'ctx.act4': null }]);
    });
});
