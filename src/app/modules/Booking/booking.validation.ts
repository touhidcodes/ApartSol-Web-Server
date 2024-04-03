import { z } from "zod";

const bookingRequestSchema = z.object({
  body: z.object({
    flatId: z.string({
      required_error: "Flat Id  is required",
    }),
  }),
});

export const bookingValidationSchemas = {
  bookingRequestSchema,
};
