import assert from 'power-assert';
import formatPayloads from './../../src/helper/formatPayloads.js';

describe('formatPayloads()', function() {
    const p1 = 'ctx.act';
    const p2 = { 'ctx.act1': null, 'ctx.act2': null };
    const p3 = [{ 'ctx.act3': null }, { 'ctx.act4': null }];

    it('should retrun formated payload(s)', function() {
        const $p1 = formatPayloads(p1);
        const $p2 = formatPayloads(p2);
        const $p3 = formatPayloads(p3);

        assert.deepEqual($p1, [{ 'ctx.act': null }]);
        assert.deepEqual($p2, [{ 'ctx.act1': null }, { 'ctx.act2': null }]);
        assert.deepEqual($p3, [{ 'ctx.act3': null }, { 'ctx.act4': null }]);
    });
});
