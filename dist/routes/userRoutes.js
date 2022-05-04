"use strict";
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express = __importStar(require("express"));
const UserController_1 = __importDefault(require("../models/UserController"));
const JSONResponse_1 = __importDefault(require("../libs/JSONResponse"));
const user_router = express.Router();
user_router.get('/users', (req, res) => {
    try {
        let uc = new UserController_1.default();
        let users = uc.getUsers();
        JSONResponse_1.default.success(req, res, null, users);
    }
    catch (error) {
        console.log(error.message, error.stack);
        JSONResponse_1.default.serverError(req, res, null, null);
    }
});
// router.get('/students/:email/assignments', (req, res) => {
//     try {
//         let student: Student = new Student(req.params.email)
//         let assignments = student.getAssignments()
//         JSONResponse.success(req, res, null, assignments)
//     } catch (error) {
//         console.log(error.message, error.stack)
//         JSONResponse.serverError(req, res, null, null)
//     }
// })
exports.default = user_router;
//# sourceMappingURL=userRoutes.js.map