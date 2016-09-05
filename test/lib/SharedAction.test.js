import assert from 'power-assert';
import SharedAction from './../../src/lib/SharedAction.js';

describe('SharedAction', function() {
    beforeEach(function() {
        const mixin = {
            privates: {
                hello() {
                    return 'hello';
                }
            }
        };

        this.shared = new SharedAction({
            context: 'shared',
            mixins: [mixin],
            greet() {
                return this.privates.hello();
            }
        });
    });

    it('shuold bound this functional option', function() {
        assert.equal(this.shared.greet(), 'hello');
    });
});
