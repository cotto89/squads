const mixins = {
    actions: {
        clear() { this.trigger('shared.clear'); }
    }
};

export const counterSrc = {
    context: 'counter',
    state: { count: 0 },
    mixins: [mixins],
    actions: {
        up(num = 1) { return { count: this.state.count + num }; }
    },
    subscribe: {
        'shared.clear': function(num = 0) {
            return { count: num };
        }
    }
};

export const sharedSrc = {
    context: 'shared',
    clear() { return 0; },
    asyncClear() { return Promise.resolve(0); }
};
