"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.flatValidationSchemas = void 0;
const zod_1 = require("zod");
const createFlatSchema = zod_1.z.object({
    body: zod_1.z.object({
        squareFeet: zod_1.z
            .number({
            required_error: "Square feet is required and must be a positive integer less than 100000",
        })
            .int()
            .min(1)
            .max(99999),
        totalBedrooms: zod_1.z
            .number({
            required_error: "Total bedrooms is required and must be a positive integer less than or equal to 4",
        })
            .int()
            .min(1)
            .max(4),
        totalRooms: zod_1.z
            .number({
            required_error: "Total rooms is required and must be a positive integer less than or equal to 6",
        })
            .int()
            .min(1)
            .max(6),
        utilitiesDescription: zod_1.z.string({
            required_error: "Utilities description is required",
        }),
        location: zod_1.z.string({
            required_error: "Location is required",
        }),
        description: zod_1.z.string({
            required_error: "Description is required",
        }),
        rent: zod_1.z
            .number({
            required_error: "Rent amount is required and must be a positive integer",
        })
            .int()
            .min(1),
        advanceAmount: zod_1.z
            .number({
            required_error: "Advance amount is required and must be a positive integer",
        })
            .int()
            .min(1),
    }),
});
const updateFlatSchema = zod_1.z.object({
    body: zod_1.z.object({
        squareFeet: zod_1.z.number().int().min(1).max(99999).optional(),
        totalBedrooms: zod_1.z.number().int().min(1).max(4).optional(),
        totalRooms: zod_1.z.number().int().min(1).max(6).optional(),
        utilitiesDescription: zod_1.z.string().optional(),
        location: zod_1.z.string().optional(),
        description: zod_1.z.string().optional(),
        rent: zod_1.z.number().int().min(1).optional(),
        advanceAmount: zod_1.z.number().int().min(1).optional(),
    }),
});
exports.flatValidationSchemas = {
    createFlatSchema,
    updateFlatSchema,
};
