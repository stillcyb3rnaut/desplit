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
exports.addDebt = addDebt;
exports.settleDebt = settleDebt;
exports.getDebtAmount = getDebtAmount;
const prismaClient_1 = require("../utils/prismaClient");
////post 
function addDebt(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const { creditorAddress, debtorAddress, amount } = req.body;
        try {
            // Ensure amount is valid
            if (!amount || amount <= 0) {
                return res.status(400).json({ error: "Invalid amount" });
            }
            // Fetch users by their addresses
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
            // Check if a debt record already exists
            const existingDebt = yield prismaClient_1.prisma.debt.findFirst({
                where: {
                    debtorId: debtor.id,
                    creditorId: creditor.id,
                },
            });
            if (existingDebt) {
                // Update the existing debt amount
                yield prismaClient_1.prisma.debt.update({
                    where: { id: existingDebt.id },
                    data: { amount: existingDebt.amount + amount },
                });
            }
            else {
                // Create a new debt record
                yield prismaClient_1.prisma.debt.create({
                    data: {
                        debtorId: debtor.id,
                        creditorId: creditor.id,
                        amount,
                    },
                });
            }
            return res.json({ message: "Debt added successfully" });
        }
        catch (error) {
            console.error(error);
            return res.status(500).json({ error: "Internal server error" });
        }
    });
}
function settleDebt(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const { creditorAddress, debtorAddress } = req.body;
        try {
            // Find the creditor and debtor by address
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
            // Find existing debt
            const existingDebt = yield prismaClient_1.prisma.debt.findFirst({
                where: { creditorId: creditor.id, debtorId: debtor.id },
            });
            const reverseDebt = yield prismaClient_1.prisma.debt.findFirst({
                where: { creditorId: debtor.id, debtorId: creditor.id },
            });
            if (!existingDebt && !reverseDebt) {
                return res.status(400).json({ error: "No debt found between these users" });
            }
            // Settle both debts (if they exist)
            if (existingDebt) {
                yield prismaClient_1.prisma.debt.update({
                    where: { id: existingDebt.id },
                    data: { amount: 0 },
                });
            }
            if (reverseDebt) {
                yield prismaClient_1.prisma.debt.update({
                    where: { id: reverseDebt.id },
                    data: { amount: 0 },
                });
            }
            return res.json({ message: "Debt settled successfully" });
        }
        catch (error) {
            console.error(error);
            return res.status(500).json({ error: "Internal server error" });
        }
    });
}
///get 
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
