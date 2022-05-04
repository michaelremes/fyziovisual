"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const App_1 = __importDefault(require("./App"));
const port = 3000;
App_1.default.get('/', (req, res) => {
    res.send('typescript server changed is running!');
});
App_1.default.listen(port, () => {
    //   if (err) {
    //     return console.error(err);
    //   }
    console.log(`server is listening on ${port}`);
});
//# sourceMappingURL=server.js.map