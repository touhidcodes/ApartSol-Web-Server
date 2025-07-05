import { z } from "zod";
import { DiscountType } from "@prisma/client";

const createCouponSchema = z.object({
  body: z
    .object({
      code: z
        .string({
          required_error: "Coupon code is required",
        })
        .min(3, "Coupon code must be at least 3 characters"),

      title: z.string({
        required_error: "Title is required",
      }),

      description: z.string().optional(),

      discountType: z.nativeEnum(DiscountType, {
        required_error: "Discount type is required",
      }),

      discountValue: z
        .number({
          required_error: "Discount value is required",
        })
        .positive("Discount value must be positive"),

      maxDiscountAmount: z.number().positive().optional(),

      minOrderAmount: z.number().positive().optional(),

      maxUsage: z.number().int().positive().optional(),

      maxUsagePerUser: z.number().int().positive().optional(),

      isActive: z.boolean().default(true),

      validFrom: z.string().datetime({
        message: "Valid from date is required",
      }),

      validUntil: z.string().datetime({
        message: "Valid until date is required",
      }),
    })
    .refine(
      (data) => {
        const validFrom = new Date(data.validFrom);
        const validUntil = new Date(data.validUntil);
        return validFrom < validUntil;
      },
      {
        message: "Valid from date must be before valid until date",
        path: ["validUntil"],
      }
    )
    .refine(
      (data) => {
        if (data.discountType === DiscountType.PERCENTAGE) {
          return data.discountValue <= 100;
        }
        return true;
      },
      {
        message: "Percentage discount cannot exceed 100%",
        path: ["discountValue"],
      }
    ),
});

const updateCouponSchema = z.object({
  body: z
    .object({
      code: z
        .string()
        .min(3, "Coupon code must be at least 3 characters")
        .optional(),
      title: z.string().optional(),
      description: z.string().optional(),
      discountType: z.nativeEnum(DiscountType).optional(),
      discountValue: z
        .number()
        .positive("Discount value must be positive")
        .optional(),
      maxDiscountAmount: z.number().positive().optional(),
      minOrderAmount: z.number().positive().optional(),
      maxUsage: z.number().int().positive().optional(),
      maxUsagePerUser: z.number().int().positive().optional(),
      isActive: z.boolean().optional(),
      validFrom: z.string().datetime().optional(),
      validUntil: z.string().datetime().optional(),
    })
    .refine(
      (data) => {
        if (data.validFrom && data.validUntil) {
          const validFrom = new Date(data.validFrom);
          const validUntil = new Date(data.validUntil);
          return validFrom < validUntil;
        }
        return true;
      },
      {
        message: "Valid from date must be before valid until date",
        path: ["validUntil"],
      }
    )
    .refine(
      (data) => {
        if (
          data.discountType === DiscountType.PERCENTAGE &&
          data.discountValue
        ) {
          return data.discountValue <= 100;
        }
        return true;
      },
      {
        message: "Percentage discount cannot exceed 100%",
        path: ["discountValue"],
      }
    ),
});

const validateCouponSchema = z.object({
  body: z.object({
    orderAmount: z
      .number({
        required_error: "Order amount is required",
      })
      .positive("Order amount must be positive"),
  }),
});

export const couponValidationSchemas = {
  createCouponSchema,
  updateCouponSchema,
  validateCouponSchema,
};
