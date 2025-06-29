import { Property, Prisma } from "@prisma/client";
import prisma from "../../utils/prisma";
import { TPaginationOptions } from "../../interfaces/pagination";
import { paginationHelper } from "../../utils/paginationHelpers";
import { propertySearchableFields } from "./property.constants";

const createProperty = async (propertyData: Property, userId: string) => {
  const data = {
    ...propertyData,
    userId,
  };
  const result = await prisma.property.create({
    data: data,
  });
  return result;
};

const getAllProperties = async (params: any, options: TPaginationOptions) => {
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

  const andConditions: Prisma.PropertyWhereInput[] = [];

  if (searchTerm) {
    andConditions.push({
      OR: propertySearchableFields.map((field) => ({
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

  const whereConditions: Prisma.PropertyWhereInput =
    andConditions.length > 0 ? { AND: andConditions } : {};

  const result = await prisma.property.findMany({
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

  const total = await prisma.property.count({
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

const getSingleProperty = async (propertyId: string) => {
  const result = await prisma.property.findUniqueOrThrow({
    where: {
      id: propertyId,
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

const getMyProperties = async (userId: string) => {
  const result = await prisma.property.findMany({
    where: {
      userId: userId,
      availability: true,
    },
  });
  return result;
};

const updateProperty = async (
  propertyId: string,
  propertyData: Partial<Property>
) => {
  const result = await prisma.property.update({
    where: {
      id: propertyId,
    },
    data: propertyData,
  });
  return result;
};

const deleteProperty = async (propertyId: string) => {
  const result = await prisma.property.update({
    where: {
      id: propertyId,
    },
    data: {
      availability: false,
    },
  });
  return result;
};

export const propertyServices = {
  createProperty,
  getAllProperties,
  updateProperty,
  getSingleProperty,
  getMyProperties,
  deleteProperty,
};
