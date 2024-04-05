"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.bookingValidationSchemas = void 0;
const zod_1 = require("zod");
const bookingRequestSchema = zod_1.z.object({
    body: zod_1.z.object({
        flatId: zod_1.z.string({
            required_error: "Flat Id  is required",
        }),
    }),
});
const updateBookingSchema = zod_1.z.object({
    body: zod_1.z.object({
        status: zod_1.z.string({
            required_error: "status  is required",
        }),
    }),
});
exports.bookingValidationSchemas = {
    bookingRequestSchema,
    updateBookingSchema,
};
