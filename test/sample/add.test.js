const assert = require('assert');
import add from './../../src/add.js';

describe('what?', () => {
  it('arguments should be type of number', () => {
    add('string', 'string'); // phantomJSだと通ってしまうので注意
  });

  it('should return x + y', () => {
    const result = add(1, 2);
    assert.equal(result, 3); // <= Wrong
  });
});
