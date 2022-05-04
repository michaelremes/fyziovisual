"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const userRoutes_1 = __importDefault(require("./routes/userRoutes"));
const bodyParser = __importStar(require("body-parser"));
class App {
    constructor() {
        this.express = express_1.default();
        this.express.use(bodyParser.json({ limit: '50mb' }));
        this.loadRoutes();
    }
    loadRoutes() {
        this.express.use('/', userRoutes_1.default);
    }
}
exports.default = new App().express;
//# sourceMappingURL=App.js.map