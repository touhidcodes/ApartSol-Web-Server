import { Coupon, Prisma } from "@prisma/client";
import prisma from "../../utils/prisma";
import { TPaginationOptions } from "../../interfaces/pagination";
import { paginationHelper } from "../../utils/paginationHelpers";
import { couponSearchableFields } from "./coupon.constants";

const createCoupon = async (couponData: Coupon) => {
  const result = await prisma.coupon.create({
    data: couponData,
  });
  return result;
};

const getAllCoupons = async (params: any, options: TPaginationOptions) => {
  const { page, limit, skip } = paginationHelper.calculatePagination(options);

  const {
    searchTerm,
    isActive,
    discountType,
    minDiscountValue,
    maxDiscountValue,
    ...filterData
  } = params;

  const andConditions: Prisma.CouponWhereInput[] = [];

  if (searchTerm) {
    andConditions.push({
      OR: couponSearchableFields.map((field) => ({
        [field]: {
          contains: searchTerm,
          mode: "insensitive",
        },
      })),
    });
  }

  if (isActive !== undefined) {
    andConditions.push({
      isActive: isActive === "true",
    });
  }

  if (discountType) {
    andConditions.push({
      discountType: {
        equals: discountType,
      },
    });
  }

  if (minDiscountValue) {
    andConditions.push({
      discountValue: {
        gte: parseFloat(minDiscountValue),
      },
    });
  }

  if (maxDiscountValue) {
    andConditions.push({
      discountValue: {
        lte: parseFloat(maxDiscountValue),
      },
    });
  }

  // Handle other filter data
  if (Object.keys(filterData).length > 0) {
    const filterConditions = Object.keys(filterData).map((key) => ({
      [key]: {
        equals: (filterData as any)[key],
      },
    }));

    andConditions.push({
      AND: filterConditions,
    });
  }

  const whereConditions: Prisma.CouponWhereInput =
    andConditions.length > 0 ? { AND: andConditions } : {};

  const result = await prisma.coupon.findMany({
    where: whereConditions,
    skip,
    take: limit,
    orderBy:
      options.sortBy && options.sortOrder
        ? {
            [options.sortBy]: options.sortOrder,
          }
        : {
            createdAt: "desc",
          },
  });

  const total = await prisma.coupon.count({
    where: whereConditions,
  });

  return {
    meta: {
      page,
      limit,
      total,
    },
    data: result,
  };
};

const getSingleCoupon = async (couponId: string) => {
  const result = await prisma.coupon.findUniqueOrThrow({
    where: {
      id: couponId,
    },
    include: {
      payments: {
        include: {
          user: {
            select: {
              id: true,
              username: true,
              email: true,
            },
          },
          booking: {
            include: {
              property: {
                select: {
                  id: true,
                  title: true,
                },
              },
            },
          },
        },
      },
    },
  });

  return result;
};

const getCouponByCode = async (code: string) => {
  const result = await prisma.coupon.findUnique({
    where: {
      code: code,
    },
  });

  return result;
};

const validateCoupon = async (
  code: string,
  orderAmount: number,
  userId: string
) => {
  const coupon = await prisma.coupon.findUnique({
    where: {
      code: code,
    },
  });

  if (!coupon) {
    throw new Error("Invalid coupon code");
  }

  if (!coupon.isActive) {
    throw new Error("Coupon is not active");
  }

  const now = new Date();
  if (now < coupon.validFrom || now > coupon.validUntil) {
    throw new Error("Coupon has expired or not yet valid");
  }

  if (coupon.minOrderAmount && orderAmount < coupon.minOrderAmount) {
    throw new Error(`Minimum order amount is ${coupon.minOrderAmount}`);
  }

  if (coupon.maxUsage && coupon.currentUsage >= coupon.maxUsage) {
    throw new Error("Coupon usage limit exceeded");
  }

  if (coupon.maxUsagePerUser) {
    const userUsageCount = await prisma.payment.count({
      where: {
        couponId: coupon.id,
        userId: userId,
      },
    });

    if (userUsageCount >= coupon.maxUsagePerUser) {
      throw new Error("You have exceeded the usage limit for this coupon");
    }
  }

  // Calculate discount amount
  let discountAmount = 0;
  if (coupon.discountType === "PERCENTAGE") {
    discountAmount = (orderAmount * coupon.discountValue) / 100;
    if (coupon.maxDiscountAmount && discountAmount > coupon.maxDiscountAmount) {
      discountAmount = coupon.maxDiscountAmount;
    }
  } else {
    discountAmount = coupon.discountValue;
  }

  return {
    coupon,
    discountAmount,
    finalAmount: orderAmount - discountAmount,
  };
};

const updateCoupon = async (couponId: string, couponData: Partial<Coupon>) => {
  const result = await prisma.coupon.update({
    where: {
      id: couponId,
    },
    data: couponData,
  });
  return result;
};

const deleteCoupon = async (couponId: string) => {
  const result = await prisma.coupon.delete({
    where: {
      id: couponId,
    },
  });
  return result;
};

const incrementCouponUsage = async (couponId: string) => {
  const result = await prisma.coupon.update({
    where: {
      id: couponId,
    },
    data: {
      currentUsage: {
        increment: 1,
      },
    },
  });
  return result;
};

const getActiveCoupons = async (options: TPaginationOptions) => {
  const { page, limit, skip } = paginationHelper.calculatePagination(options);

  const now = new Date();

  const result = await prisma.coupon.findMany({
    where: {
      isActive: true,
      validFrom: {
        lte: now,
      },
      validUntil: {
        gte: now,
      },
    },
    skip,
    take: limit,
    orderBy: {
      createdAt: "desc",
    },
  });

  const total = await prisma.coupon.count({
    where: {
      isActive: true,
      validFrom: {
        lte: now,
      },
      validUntil: {
        gte: now,
      },
    },
  });

  return {
    meta: {
      page,
      limit,
      total,
    },
    data: result,
  };
};

export const couponServices = {
  createCoupon,
  getAllCoupons,
  getSingleCoupon,
  getCouponByCode,
  validateCoupon,
  updateCoupon,
  deleteCoupon,
  incrementCouponUsage,
  getActiveCoupons,
};
