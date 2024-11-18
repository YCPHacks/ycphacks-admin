export default class UserAdapter {
    constructor(adapter) {
        this.id = adapter.id || 0;
        this.firstName = adapter.firstName || "";
        this.lastName = adapter.lastName || "";
        this.email = adapter.email || "";
        this.role = adapter.role || 0;
        this.token = adapter.token || "";
    }
}
