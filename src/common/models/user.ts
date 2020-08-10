export default class User {
    isConnected: boolean;

    constructor(isConnected = false) {
        this.isConnected = isConnected;
    }
}