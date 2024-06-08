"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.userValidationSchema = void 0;
const zod_1 = require("zod");
const createUserSchema = zod_1.z.object({
    body: zod_1.z.object({
        username: zod_1.z.string({ required_error: "Username is required" }),
        email: zod_1.z.string({ required_error: "Email is required" }),
        password: zod_1.z
            .string({ required_error: "Password is required" })
            .min(8, { message: "Password must be at least 8 characters long" }),
    }),
});
const updateUserSchema = zod_1.z.object({
    body: zod_1.z.object({
        image: zod_1.z.string().optional(),
        name: zod_1.z.string().optional(),
        bio: zod_1.z.string().optional(),
        profession: zod_1.z.string().optional(),
        address: zod_1.z.string().optional(),
        status: zod_1.z.string().optional(),
        role: zod_1.z.string().optional(),
    }),
});
exports.userValidationSchema = {
    createUserSchema,
    updateUserSchema,
};
