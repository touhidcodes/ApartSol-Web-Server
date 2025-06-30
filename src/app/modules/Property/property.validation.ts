import { z } from "zod";

const PropertyTypeEnum = z.enum(["RESIDENTIAL", "COMMERCIAL"]);
const PurposeEnum = z.enum(["RENT", "SALE"]);

const createPropertySchema = z.object({
  body: z.object({
    squareFeet: z
      .number({
        required_error:
          "Square feet is required and must be a positive integer less than 100000",
      })
      .int()
      .min(1)
      .max(99999),

    totalBedrooms: z
      .number({
        required_error:
          "Total bedrooms is required and must be a positive integer less than or equal to 4",
      })
      .int()
      .min(1)
      .max(4),

    totalRooms: z
      .number({
        required_error:
          "Total rooms is required and must be a positive integer less than or equal to 6",
      })
      .int()
      .min(1)
      .max(6),

    totalBathrooms: z
      .number({
        required_error:
          "Total bathrooms is required and must be a positive integer less than or equal to 4",
      })
      .int()
      .min(1)
      .max(4),

    propertyType: PropertyTypeEnum,
    purpose: PurposeEnum,

    amenities: z
      .array(z.string({ required_error: "Amenity must be a string" }))
      .nonempty({ message: "At least one amenity is required" }),

    title: z.string({ required_error: "Property title is required" }),
    description: z.string({ required_error: "Description is required" }),

    street: z.string().optional(),
    city: z.string().optional(),
    state: z.string().optional(),
    zipCode: z.string().optional(),
    country: z.string().optional(),

    rent: z
      .number({
        required_error:
          "Rent amount is required and must be a positive integer",
      })
      .int()
      .min(1),

    advanceAmount: z
      .number({
        required_error:
          "Advance amount is required and must be a positive integer",
      })
      .int()
      .min(1),
  }),
});

const updatePropertySchema = z.object({
  body: z.object({
    squareFeet: z.number().int().min(1).max(99999).optional(),
    totalBedrooms: z.number().int().min(1).max(4).optional(),
    totalRooms: z.number().int().min(1).max(6).optional(),
    totalBathrooms: z.number().int().min(1).max(4).optional(),
    propertyType: PropertyTypeEnum.optional(),
    purpose: PurposeEnum.optional(),
    amenities: z.array(z.string()).optional(),
    title: z.string().optional(),
    description: z.string().optional(),
    street: z.string().optional(),
    city: z.string().optional(),
    state: z.string().optional(),
    zipCode: z.string().optional(),
    country: z.string().optional(),
    rent: z.number().int().min(1).optional(),
    advanceAmount: z.number().int().min(1).optional(),
  }),
});

export const propertyValidationSchemas = {
  createPropertySchema,
  updatePropertySchema,
};
