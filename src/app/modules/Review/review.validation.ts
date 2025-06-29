import { z } from "zod";

// Schema for creating a review
const createReviewSchema = z.object({
  body: z.object({
    name: z.string({
      required_error: "Name is required",
    }),
    email: z
      .string({
        required_error: "Email is required",
      })
      .email("Email must be valid"),
    rating: z.string({
      required_error: "Rating is required",
    }),
    comment: z.string({
      required_error: "Comment is required",
    }),
  }),
});

// Schema for updating a review
const updateReviewSchema = z.object({
  body: z.object({
    name: z.string().optional(),
    email: z.string().email("Email must be valid").optional(),
    rating: z.string().optional(),
    comment: z.string().optional(),
  }),
});

export const reviewValidationSchemas = {
  createReviewSchema,
  updateReviewSchema,
};
