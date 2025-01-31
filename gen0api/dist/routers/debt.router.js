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
exports.debtRouter = void 0;
const express_1 = require("express");
const debt_controller_1 = require("../controllers/debt.controller");
exports.debtRouter = (0, express_1.Router)();
exports.debtRouter.post('/getDebt', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    yield (0, debt_controller_1.getDebtAmount)(req, res);
}));
exports.debtRouter.post('/addDebt', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    yield (0, debt_controller_1.addDebt)(req, res);
}));
exports.debtRouter.post('/settleDebt', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    yield (0, debt_controller_1.settleDebt)(req, res);
}));
