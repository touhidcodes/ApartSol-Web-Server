import { Flat } from "@prisma/client";
import prisma from "../../utils/prisma";

const createFlat = async (flatData: Flat) => {
  const result = await prisma.flat.create({
    data: flatData,
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

export const flatServices = {
  createFlat,
  updateFlat,
};
