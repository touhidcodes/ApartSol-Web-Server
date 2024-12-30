import { Blog, Prisma } from "@prisma/client";
import prisma from "../../utils/prisma";
import { TPaginationOptions } from "../../interfaces/pagination";
import { paginationHelper } from "../../utils/paginationHelpers";
import { blogSearchableFields } from "./blog.constants";

const createBlog = async (blogData: Blog, authorId: string) => {
  const data = {
    ...blogData,
    authorId,
  };
  const result = await prisma.blog.create({
    data: data,
  });
  return result;
};

const getBlogs = async (params: any, options: TPaginationOptions) => {
  const { page, limit, skip } = paginationHelper.calculatePagination(options);
  const { searchTerm, tags, isPublished, ...filterData } = params;

  const andConditions: Prisma.BlogWhereInput[] = [];

  if (searchTerm) {
    andConditions.push({
      OR: blogSearchableFields.map((field) => ({
        [field]: {
          contains: searchTerm,
          mode: "insensitive",
        },
      })),
    });
  }

  if (tags && tags.length > 0) {
    andConditions.push({
      tags: {
        hasSome: tags,
      },
    });
  }

  if (isPublished !== undefined) {
    andConditions.push({
      isPublished: isPublished === "true" ? true : false,
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

  const whereConditions: Prisma.BlogWhereInput =
    andConditions.length > 0 ? { AND: andConditions } : {};

  const result = await prisma.blog.findMany({
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

  const total = await prisma.blog.count({
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

const getSingleBlog = async (blogId: string) => {
  const result = await prisma.blog.findUniqueOrThrow({
    where: {
      id: blogId,
    },
  });
  return result;
};

const getMyBlogs = async (authorId: string) => {
  const result = await prisma.blog.findMany({
    where: {
      authorId: authorId,
    },
    orderBy: {
      createdAt: "desc",
    },
  });
  return result;
};

const updateBlog = async (blogId: string, blogData: Partial<Blog>) => {
  const result = await prisma.blog.update({
    where: {
      id: blogId,
    },
    data: blogData,
  });
  return result;
};

const deleteBlog = async (blogId: string) => {
  const result = await prisma.blog.delete({
    where: {
      id: blogId,
    },
  });
  return result;
};

export const blogServices = {
  createBlog,
  getBlogs,
  getSingleBlog,
  getMyBlogs,
  updateBlog,
  deleteBlog,
};
