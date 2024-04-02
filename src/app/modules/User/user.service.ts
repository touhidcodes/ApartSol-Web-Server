import * as bcrypt from "bcrypt";
import prisma from "../../utils/prisma";
import { UserProfile } from "@prisma/client";

const createUser = async (data: TUserData) => {
  const hashedPassword: string = await bcrypt.hash(data.password, 12);
  const userData = {
    name: data.name,
    email: data.email,
    password: hashedPassword,
  };

  const userProfileData = {
    bio: data.bio,
    profession: data.profession,
    address: data.address,
  };

  const result = await prisma.$transaction(async (transactionClient) => {
    const createdUserData = await transactionClient.user.create({
      data: userData,
      select: {
        id: true,
        name: true,
        email: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    const userId = createdUserData.id;

    await transactionClient.userProfile.create({
      data: {
        ...userProfileData,
        userId: userId,
      },
    });

    return createdUserData;
  });

  return result;
};

const getUser = async (id: string) => {
  const result = await prisma.userProfile.findUniqueOrThrow({
    where: {
      userId: id,
    },
  });
  return result;
};

const updateUser = async (id: string, userData: Partial<UserProfile>) => {
  const result = await prisma.userProfile.update({
    where: {
      userId: id,
    },
    data: userData,
  });
  return result;
};

export const userServices = {
  createUser,
  getUser,
  updateUser,
};
