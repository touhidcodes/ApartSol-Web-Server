import { Flat, Prisma } from "@prisma/client";
import prisma from "../../utils/prisma";
import { TPaginationOptions } from "../../interfaces/pagination";
import { paginationHelper } from "../../utils/paginationHelpers";
import { flatSearchableFields } from "./flat.constants";

const createFlat = async (flatData: Flat, userId: string) => {
  const data = {
    ...flatData,
    userId,
  };
  const result = await prisma.flat.create({
    data: data,
  });
  return result;
};

const getFlats = async (params: any, options: TPaginationOptions) => {
  const { page, limit, skip } = paginationHelper.calculatePagination(options);
  const {
    searchTerm,
    location,
    availability,
    minPrice,
    maxPrice,
    totalBedrooms,
    amenities,
    purpose,
    ...filterData
  } = params;

  const andConditions: Prisma.FlatWhereInput[] = [];

  if (searchTerm) {
    andConditions.push({
      OR: flatSearchableFields.map((field) => ({
        [field]: {
          contains: searchTerm,
          mode: "insensitive",
        },
      })),
    });
  }

  if (availability !== undefined) {
    const availabilityFilter = availability === "true";
    andConditions.push({
      availability: availabilityFilter,
    });
  }

  if (location) {
    andConditions.push({
      OR: [
        { street: { contains: location, mode: "insensitive" } },
        { city: { contains: location, mode: "insensitive" } },
        { state: { contains: location, mode: "insensitive" } },
        { zipCode: { contains: location, mode: "insensitive" } },
        { country: { contains: location, mode: "insensitive" } },
      ],
    });
  }

  if (minPrice) {
    andConditions.push({
      rent: {
        gte: parseFloat(minPrice),
      },
    });
  }

  if (maxPrice) {
    andConditions.push({
      rent: {
        lte: parseFloat(maxPrice),
      },
    });
  }

  if (totalBedrooms) {
    andConditions.push({
      totalBedrooms: {
        equals: parseInt(totalBedrooms),
      },
    });
  }

  if (purpose) {
    andConditions.push({
      purpose: {
        equals: purpose,
      },
    });
  }

  // Handle amenities filter
  if (amenities && Array.isArray(amenities) && amenities.length > 0) {
    andConditions.push({
      amenities: {
        hasEvery: amenities,
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

  const whereConditions: Prisma.FlatWhereInput =
    andConditions.length > 0 ? { AND: andConditions } : {};

  const result = await prisma.flat.findMany({
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

  const total = await prisma.flat.count({
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

const getSingleFlat = async (flatId: string) => {
  const result = await prisma.flat.findUniqueOrThrow({
    where: {
      id: flatId,
      availability: true,
    },
    include: {
      user: {
        select: {
          UserProfile: true,
        },
      },
      review: {
        include: {
          user: {
            include: {
              UserProfile: true,
            },
          },
        },
      },
    },
  });

  return result;
};

const getMyFlats = async (userId: string) => {
  const result = await prisma.flat.findMany({
    where: {
      userId: userId,
      availability: true,
    },
  });
  return result;
};

const updateFlat = async (flatId: string, flatData: Partial<Flat>) => {
  const result = await prisma.flat.update({
    where: {
      id: flatId,
    },
    data: flatData,
  });
  return result;
};

const deleteFlat = async (flatId: string) => {
  const result = await prisma.flat.update({
    where: {
      id: flatId,
    },
    data: {
      availability: false,
    },
  });
  return result;
};

export const flatServices = {
  createFlat,
  getFlats,
  updateFlat,
  getSingleFlat,
  getMyFlats,
  deleteFlat,
};
