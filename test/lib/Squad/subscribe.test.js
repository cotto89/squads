/* eslint-disable no-new */
import assert from 'power-assert';
import merge from 'lodash.merge';
import cloneDeep from 'lodash.clonedeep';
import sinon from 'sinon';
import { Store, dispatch, Squad, SharedAction } from './../../../src/index.js';
import emitter from './../../../src/lib/ActionEmitter.js';
import { counterSrc, sharedSrc } from './../../fixtures.js';

describe('Squad subscribe option', function() {
    beforeEach(function() {
        this.shared = new SharedAction(cloneDeep(sharedSrc));
        this.counterA = new Squad(merge({}, counterSrc, {
            context: 'counterA',
            actions: {
                clear() {
                    this.trigger('shared.asyncClear');
                }
            }
        }));

        this.counterB = new Squad(merge({}, counterSrc, {
            context: 'counterB',
            subscribe: {
                'counterA.up': function({ count }) {
                    return { count: count + 1 };
                }
            }
        }));

        this.store = new Store({
            squads: [this.counterA, this.counterB],
            sharedActions: [this.shared]
        });
    });

    afterEach(function() {
        emitter._clear();
        this.store.dispatcher._clear();
    });

    it('can listen other Squad action', function() {
        assert.deepEqual(this.counterB.state, { count: 0 });
        dispatch('counterA.up');
        assert.deepEqual(this.counterB.state, { count: 2 });
    });


    it('can listen SharedAction', function(done) {
        const spy = sinon.spy();
        dispatch('counterA.up');
        assert.deepEqual(this.counterA.state, { count: 1 });

        this.store.onChange(spy);
        dispatch('counterA.clear');

        setTimeout(() => {
            assert(spy.calledWith({ counterA: { count: 0 } }));
            done();
        });
    });
});
