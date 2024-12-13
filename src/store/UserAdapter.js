export default class UserAdapter {
    constructor(adapter) {
        this.id = adapter.id || 0;
        this.firstName = adapter.firstName || "tiny";
        this.lastName = adapter.lastName || "house";
        this.email = adapter.email || "tinyhouse@gmail.com";
        this.role = adapter.role || 2;
        this.token = adapter.token || "123";
    }
}
