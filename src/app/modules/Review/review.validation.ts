import { z } from "zod";

const createReviewSchema = z.object({
  body: z.object({
    rating: z.string({
      required_error: "Rating is required",
    }),
    comment: z.string(),
    flatId: z.string({
      required_error: "Flat Id is required",
    }),
  }),
});

const updateReviewSchema = z.object({
  body: z.object({
    rating: z
      .string({
        required_error: "Rating is required",
      })
      .optional(),
    comment: z.string().optional(),
  }),
});

export const reviewValidationSchemas = {
  createReviewSchema,
  updateReviewSchema,
};
