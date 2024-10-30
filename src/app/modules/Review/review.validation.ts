import { z } from "zod";

const createReviewSchema = z.object({
  body: z.object({
    rating: z.string({
      required_error: "Rating is required",
    }),
    comment: z.string({
      required_error: "Comment is required",
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
