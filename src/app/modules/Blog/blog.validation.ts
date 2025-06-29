import { z } from "zod";

// Create Blog Schema
const createBlogSchema = z.object({
  body: z.object({
    title: z.string({
      required_error: "Blog title is required",
    }),
    content: z.string({
      required_error: "Blog content is required",
    }),
    image: z.string().url("Image must be a valid URL").optional(),
    tags: z
      .array(
        z.string({
          required_error: "Each tag must be a string",
        })
      )
      .nonempty({ message: "At least one tag is required" }),
    isPublished: z.boolean().optional(),
  }),
});

// Update Blog Schema
const updateBlogSchema = z.object({
  body: z.object({
    title: z.string().optional(),
    content: z.string().optional(),
    image: z.string().url("Image must be a valid URL").optional(),
    tags: z.array(z.string()).optional(),
    isPublished: z.boolean().optional(),
  }),
});

export const blogValidationSchemas = {
  createBlogSchema,
  updateBlogSchema,
};
