import { z } from "zod";

const bookingRequestSchema = z.object({
  body: z.object({
    totalAmount: z.number({
      required_error: "Total amount is required",
    }),
    notes: z.string().optional(),
  }),
});

const updateBookingSchema = z.object({
  body: z.object({
    status: z.string({
      required_error: "status  is required",
    }),
  }),
});

export const bookingValidationSchemas = {
  bookingRequestSchema,
  updateBookingSchema,
};
