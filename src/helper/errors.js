export class RefuseError extends Error {
    constructor(...args) {
        super(...args);
        this.name = 'RefuseError';
    }
}

export class Prevent extends Error {
    constructor(...args) {
        super(...args);
        this.name = 'Prevent';
    }
}
