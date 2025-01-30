"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const body_parser_1 = __importDefault(require("body-parser"));
const dotenv_1 = __importDefault(require("dotenv"));
const auth_router_1 = __importDefault(require("./routers/auth.router"));
const group_router_1 = __importDefault(require("./routers/group.router"));
const contact_router_1 = __importDefault(require("./routers/contact.router"));
const cors_1 = __importDefault(require("cors"));
const debt_router_1 = require("./routers/debt.router");
const app = (0, express_1.default)();
dotenv_1.default.config();
app.use(body_parser_1.default.json());
app.use((0, cors_1.default)());
app.get('/hi', (req, res) => {
    res.send("Hello");
});
app.use('/api/v0', auth_router_1.default);
app.use('/api/v0', group_router_1.default);
app.use('/api/v0', contact_router_1.default);
app.use('/api/v0', debt_router_1.debtRouter);
const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
    console.log(`Server running on ${PORT}`);
});
