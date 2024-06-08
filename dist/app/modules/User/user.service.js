"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.userServices = void 0;
const bcrypt = __importStar(require("bcrypt"));
const prisma_1 = __importDefault(require("../../utils/prisma"));
const APIError_1 = __importDefault(require("../../errors/APIError"));
const http_status_1 = __importDefault(require("http-status"));
const config_1 = __importDefault(require("../../config/config"));
const createUser = (data) => __awaiter(void 0, void 0, void 0, function* () {
    const existingUser = yield prisma_1.default.user.findUnique({
        where: {
            username: data.username,
        },
    });
    if (existingUser) {
        throw new APIError_1.default(http_status_1.default.CONFLICT, "Username is already taken");
    }
    const hashedPassword = yield bcrypt.hash(data.password, 12);
    const userData = {
        username: data.username,
        email: data.email,
        role: data.role,
        password: hashedPassword,
    };
    const result = yield prisma_1.default.$transaction((transactionClient) => __awaiter(void 0, void 0, void 0, function* () {
        const createdUserData = yield transactionClient.user.create({
            data: userData,
            select: {
                id: true,
                username: true,
                email: true,
                createdAt: true,
                updatedAt: true,
            },
        });
        const userId = createdUserData.id;
        yield transactionClient.userProfile.create({
            data: {
                userId: userId,
            },
        });
        return createdUserData;
    }));
    return result;
});
const getUser = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield prisma_1.default.user.findUniqueOrThrow({
        where: {
            id: id,
        },
        select: {
            id: true,
            email: true,
            role: true,
            username: true,
        },
    });
    return result;
});
const getAllUser = (currentUserEmail) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield prisma_1.default.user.findMany({
        where: {
            email: {
                notIn: [config_1.default.superAdmin.super_admin_email, currentUserEmail],
            },
        },
    });
    return result;
});
const getUserWithProfile = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield prisma_1.default.user.findUniqueOrThrow({
        where: {
            id: id,
        },
        select: {
            id: true,
            email: true,
            role: true,
            username: true,
        },
    });
    const profile = yield prisma_1.default.userProfile.findUniqueOrThrow({
        where: {
            userId: user.id,
        },
    });
    return Object.assign(Object.assign({}, user), profile);
});
const getUserProfile = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield prisma_1.default.userProfile.findUniqueOrThrow({
        where: {
            userId: id,
        },
    });
    return result;
});
const updateUser = (id, userData) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, username } = userData, profileData = __rest(userData, ["email", "username"]);
    // Retrieve the current user
    const existingUser = yield prisma_1.default.user.findUniqueOrThrow({
        where: {
            id: id,
        },
    });
    // Check if the username or email is being updated
    if (username && username !== existingUser.username) {
        const existingUsername = yield prisma_1.default.user.findUnique({
            where: {
                username: username,
            },
        });
        if (existingUsername) {
            throw new APIError_1.default(http_status_1.default.CONFLICT, "Username is already taken");
        }
    }
    if (email && email !== existingUser.email) {
        const existingEmail = yield prisma_1.default.user.findUnique({
            where: {
                email: email,
            },
        });
        if (existingEmail) {
            throw new APIError_1.default(http_status_1.default.CONFLICT, "Email is already taken");
        }
    }
    // Update user
    const result = yield prisma_1.default.user.update({
        where: {
            id: id,
        },
        data: {
            username: username || existingUser.username,
            email: email || existingUser.email,
        },
        select: {
            id: true,
            username: true,
            email: true,
            role: true,
            createdAt: true,
            updatedAt: true,
        },
    });
    // Update user profile
    const updatedProfile = yield prisma_1.default.userProfile.update({
        where: {
            userId: id,
        },
        data: profileData,
    });
    return Object.assign(Object.assign({}, result), updatedProfile);
});
//  update user status
const updateUserStatus = (userId, updatedData) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield prisma_1.default.user.update({
        where: { id: userId },
        data: updatedData,
    });
    return result;
});
exports.userServices = {
    createUser,
    getUser,
    getUserProfile,
    updateUser,
    getUserWithProfile,
    getAllUser,
    updateUserStatus,
};
