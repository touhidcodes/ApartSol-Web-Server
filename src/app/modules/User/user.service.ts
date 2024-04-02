import * as bcrypt from "bcrypt";
import prisma from "../../utils/prisma";

const createUser = async (data: TUserData) => {
  // console.log(data);
  const hashedPassword: string = await bcrypt.hash(data.password, 12);
  const userData = {
    name: data.name,
    email: data.email,
    password: hashedPassword,
  };
  console.log(userData);

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

export const userServices = {
  createUser,
};
