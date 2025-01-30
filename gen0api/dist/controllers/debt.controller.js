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
exports.getDebtAmount = getDebtAmount;
const prismaClient_1 = require("../utils/prismaClient");
function getDebtAmount(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const { creditorAddress, debtorAddress } = req.body;
        try {
            // Fetch the users based on their addresses
            const creditor = yield prismaClient_1.prisma.user.findUnique({
                where: { address: creditorAddress },
            });
            const debtor = yield prismaClient_1.prisma.user.findUnique({
                where: { address: debtorAddress },
            });
            // Check if both users exist
            if (!creditor) {
                return res.status(404).json({ error: "Creditor not found" });
            }
            if (!debtor) {
                return res.status(404).json({ error: "Debtor not found" });
            }
            // Fetch the debt record between the creditor and the debtor
            const debt = yield prismaClient_1.prisma.debt.findFirst({
                where: {
                    debtorId: debtor.id,
                    creditorId: creditor.id,
                },
            });
            // If no debt exists, return 0
            const amount = debt ? debt.amount : 0;
            return res.json({ amount });
        }
        catch (e) {
            console.error(e);
            return res.status(500).json({ error: "Internal server error" });
        }
    });
}
