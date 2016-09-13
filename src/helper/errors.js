export class RefusePromise extends Error {
    constructor(...args) {
        super(...args);
        this.name = 'RefusePromise';
    }
}

export class Prevent extends Error {
    constructor(...args) {
        super(...args);
        this.name = 'Prevent';
    }
}
