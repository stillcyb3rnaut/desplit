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
exports.getContacts = getContacts;
const prismaClient_1 = require("../utils/prismaClient");
// get contacts
function getContacts(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const { address } = req.params;
        if (!address) {
            return res.status(400).json({ msg: "Please provide the address of user" });
        }
        try {
            const user = yield prismaClient_1.prisma.user.findUnique({
                where: { address },
                select: { contacts: true }
            });
            if (!user) {
                return res.json(400).json({ msg: "No user found" });
            }
            return res.status(200).json({ contacts: user.contacts });
        }
        catch (e) {
            console.log(e);
            return res.status(500).json({ msg: "Server error" });
        }
    });
}
