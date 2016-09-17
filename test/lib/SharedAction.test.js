import assert from 'power-assert';
import merge from 'lodash.merge';
import cloneDeep from 'lodash.clonedeep';
import isFunction from 'lodash.isfunction';
import { SharedAction } from './../../src/index.js';
import emitter from './../../src/lib/ActionEmitter.js';
import { sharedSrc } from './../fixtures.js';

describe('SharedAction', function() {
    beforeEach(function() {
        this.sharedSrc = cloneDeep(sharedSrc);
    });

    afterEach(function() {
        emitter._clear();
    });


    describe('#constructor', function() {
        specify('default props of shared action', function() {
            const shared = new SharedAction(this.sharedSrc);
            assert(Object.keys(shared).includes('context'));
        });

        it('should be bound function', function() {
            const func = () => {};
            const shared = new SharedAction(merge(this.sharedSrc, { func }));
            assert.notEqual(shared.func, func);
        });

        it('add handler to ActionEmitter', function() {
            /* eslint-disable no-unused-vars */
            const shared = new SharedAction(this.sharedSrc);
            shared._connect();
            assert.deepEqual(Object.keys(emitter.shareds), ['shared']);
            assert(isFunction(emitter.shareds.shared));
        });
    });
});
