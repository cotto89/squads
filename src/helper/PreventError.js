export default class Prevent extends Error {
    constructor(...args) {
        super(...args);
        this.name = 'Prevent';
    }
}
