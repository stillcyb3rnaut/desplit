"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
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
const axios_1 = __importDefault(require("axios"));
const app = (0, express_1.default)();
dotenv_1.default.config();
app.use(body_parser_1.default.json());
app.use((0, cors_1.default)());
app.get("/hi", (req, res) => {
    res.send("Hello");
});
// Routes
app.use("/api/v0", auth_router_1.default);
app.use("/api/v0", group_router_1.default);
app.use("/api/v0", contact_router_1.default);
app.use("/api/v0", debt_router_1.debtRouter);
const PORT = process.env.PORT || 4000;
// Function to ping /hi every 5 minutes
const pingServer = () => {
    const serverUrl = `https://desplit.onrender.com/hi`; // Change this if deployed
    setInterval(() => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const response = yield axios_1.default.get(serverUrl);
            console.log("Pinged /hi:", response.data);
        }
        catch (error) {
            console.error("Error pinging /hi:", error);
        }
    }), 5 * 60 * 1000); // 5 minutes in milliseconds
};
// Start the server
app.listen(PORT, () => {
    console.log(`Server running on ${PORT}`);
    pingServer(); // Start pinging after the server starts
});
