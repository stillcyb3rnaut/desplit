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
const express_1 = require("express");
const group_controller_1 = require("../controllers/group.controller");
const router = (0, express_1.Router)();
// Explicitly typing the request handler function
router.post("/createGroup", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    yield (0, group_controller_1.createGroup)(req, res);
}));
router.get("/getGroups/:address", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    yield (0, group_controller_1.getGroups)(req, res);
}));
router.get("/getGroup/:id", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    yield (0, group_controller_1.getGroupDetails)(req, res);
}));
exports.default = router;
