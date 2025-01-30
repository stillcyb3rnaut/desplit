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
exports.createGroup = createGroup;
exports.getGroups = getGroups;
exports.getGroupDetails = getGroupDetails;
const prismaClient_1 = require("../utils/prismaClient");
function createGroup(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const { name, description, members, callerAddress } = req.body;
        if (!name || !description || !Array.isArray(members) || !callerAddress) {
            return res.status(400).json({
                error: "Invalid input. Name, description, members, and callerAddress are required.",
            });
        }
        if (members.length === 0) {
            return res.status(401).json({ msg: "At least add one member" });
        }
        try {
            // Ensure all members + caller are unique
            const allMembers = Array.from(new Set([...members, callerAddress]));
            // Fetch existing users
            const existingUsers = yield prismaClient_1.prisma.user.findMany({
                where: { address: { in: allMembers } },
            });
            const existingUserAddresses = new Set(existingUsers.map((user) => user.address));
            // Identify new users
            const newUsersData = allMembers
                .filter((address) => !existingUserAddresses.has(address))
                .map((address) => ({ address }));
            // Insert new users if needed
            if (newUsersData.length > 0) {
                yield prismaClient_1.prisma.user.createMany({ data: newUsersData });
            }
            // **Re-fetch all users (to ensure new users include `contacts`)**
            const allUsers = yield prismaClient_1.prisma.user.findMany({
                where: { address: { in: allMembers } },
            });
            // Create the group
            const group = yield prismaClient_1.prisma.group.create({
                data: {
                    name,
                    description,
                    creator: { connect: { address: callerAddress } },
                    Users: { connect: allUsers.map((user) => ({ address: user.address })) },
                },
            });
            // Update each user's contacts
            yield Promise.all(allUsers.map((user) => __awaiter(this, void 0, void 0, function* () {
                var _a;
                const otherContacts = allUsers
                    .map((u) => u.address)
                    .filter((addr) => addr !== user.address);
                yield prismaClient_1.prisma.user.update({
                    where: { address: user.address },
                    data: { contacts: { set: Array.from(new Set([...(_a = user.contacts) !== null && _a !== void 0 ? _a : [], ...otherContacts])) } },
                });
            })));
            return res.status(201).json({ msg: "Group created successfully", group });
        }
        catch (error) {
            console.error(error);
            return res.status(500).json({ error: "Internal server error" });
        }
    });
}
// add members
// remove members
// leave group 
////////get funcs
//get groups
function getGroups(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const { address } = req.params;
        if (!address) {
            return res.status(400).json({ msg: "Please provide the address of user" });
        }
        try {
            const user = yield prismaClient_1.prisma.user.findUnique({ where: { address },
                select: { groups: true } });
            if (!user) {
                return res.status(400).json({ msg: "user not find with the address" });
            }
            return res.status(200).json({ groups: user.groups });
        }
        catch (e) {
            console.log(e);
            return res.status(500).json({ msg: "INternal server error" });
        }
    });
}
function getGroupDetails(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const { id } = req.params;
        // Validate the group ID
        if (!id) {
            return res.status(400).json({ msg: 'Please provide a group ID.' });
        }
        try {
            // Fetch the group details
            const groupDetails = yield prismaClient_1.prisma.group.findUnique({
                where: { id: Number(id) },
                include: {
                    Users: true, // Include all members of the group
                    creator: true, // Include the creator of the group
                },
            });
            // If the group is not found, return a 404 error
            if (!groupDetails) {
                return res.status(404).json({ msg: 'Group not found.' });
            }
            // Return the group details
            return res.status(200).json({ group: groupDetails });
        }
        catch (e) {
            console.error(e); // Log the error for debugging
            return res.status(500).json({ msg: 'Internal server error.' });
        }
        finally {
            yield prismaClient_1.prisma.$disconnect(); // Disconnect the Prisma client
        }
    });
}
