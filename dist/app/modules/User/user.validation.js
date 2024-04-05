"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.userValidationSchema = void 0;
const zod_1 = require("zod");
const createUserSchema = zod_1.z.object({
    body: zod_1.z.object({
        name: zod_1.z.string({ required_error: "Name is required" }),
        email: zod_1.z.string({ required_error: "Email is required" }),
        password: zod_1.z
            .string({ required_error: "Password is required" })
            .min(8, { message: "Password must be at least 8 characters long" }),
        bio: zod_1.z.string({ required_error: "Bio is required" }),
        profession: zod_1.z.string({ required_error: "Profession is required" }),
        address: zod_1.z.string({ required_error: "Address is required" }),
    }),
});
const updateUserSchema = zod_1.z.object({
    body: zod_1.z.object({
        bio: zod_1.z.string().optional(),
        profession: zod_1.z.string().optional(),
        address: zod_1.z.string().optional(),
    }),
});
exports.userValidationSchema = {
    createUserSchema,
    updateUserSchema,
};
