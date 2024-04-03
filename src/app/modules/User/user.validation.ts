import { z } from "zod";

const createUserSchema = z.object({
  name: z.string({ required_error: "Name is required" }),
  email: z.string({ required_error: "Email is required" }),
  password: z
    .string({ required_error: "Password is required" })
    .min(8, { message: "Password must be at least 8 characters long" }),
  bio: z.string({ required_error: "Bio is required" }),
  profession: z.string({ required_error: "Profession is required" }),
  address: z.string({ required_error: "Address is required" }),
});

export const userValidationSchema = {
  createUserSchema,
};
