import { Flat, Prisma } from "@prisma/client";
import prisma from "../../utils/prisma";
import { TPaginationOptions } from "../../interfaces/pagination";
import { paginationHelper } from "../../utils/paginationHelpers";
import { flatSearchableFields } from "./flat.constants";

const createFlat = async (flatData: Flat) => {
  const result = await prisma.flat.create({
    data: flatData,
  });
  return result;
};

const getFlats = async (params: any, options: TPaginationOptions) => {
  const { page, limit, skip } = paginationHelper.calculatePagination(options);
  const { searchTerm, availability, ...filterData } = params;

  const andConditions: Prisma.FlatWhereInput[] = [];

  if (params.searchTerm) {
    andConditions.push({
      OR: flatSearchableFields.map((field) => ({
        [field]: {
          contains: params.searchTerm,
          mode: "insensitive",
        },
      })),
    });
  }

  // Add condition for availability because it have boolean value
  if (availability) {
    const availabilityFilter = params.availability === "true" ? true : false;
    andConditions.push({
      availability: availabilityFilter,
    });
  }

  if (Object.keys(filterData).length > 0) {
    andConditions.push({
      AND: Object.keys(filterData).map((key) => ({
        [key]: {
          equals: (filterData as any)[key],
        },
      })),
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

const updateFlat = async (flatId: string, flatData: Partial<Flat>) => {
  const result = await prisma.flat.update({
    where: {
      id: flatId,
    },
    data: flatData,
  });
  return result;
};

export const flatServices = {
  createFlat,
  getFlats,
  updateFlat,
};
