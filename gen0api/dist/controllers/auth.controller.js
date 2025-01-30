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
Object.defineProperty(exports, "__esModule", { value: true });
exports.verifyAddress = verifyAddress;
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
function verifyAddress(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const { message, signature, address } = req.body;
            if (!message || !signature || !address) {
                return res.status(400).json({ msg: "Either address, message, or signature is missing" });
            }
            console.log("Skipping verification for now.");
            let user = yield prisma.user.findUnique({ where: { address } });
            if (!user) {
                user = yield prisma.user.create({ data: { address } });
            }
            return res.status(200).json({ message: "Address accepted (verification skipped)", user });
        }
        catch (error) {
            console.error(error);
            return res.status(500).json({ error: "Internal server error" });
        }
    });
}
