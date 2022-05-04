"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class UserController {
    constructor() {
    }
    // register() {
    //     this.ID = Math.round(Math.random() * 10000)
    // }
    // getJsonObject(): Object {
    //     return {
    //         email: this.email,
    //         name: this.name,
    //         pwd: this.pwd,
    //         role: this.role,
    //         ID: this.ID
    //     }
    // }
    getUsers() {
        let user = {
            email: "test@mail.cz",
            name: "Josef Novy",
            role: "admin",
            pwd: "heslo"
        };
        let resultArr = [user, user, user];
        return resultArr;
    }
}
exports.default = UserController;
//# sourceMappingURL=UserController.js.map