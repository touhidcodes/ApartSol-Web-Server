import { Secret } from "jsonwebtoken";
import { jwtHelpers } from "../../utils/jwtHelpers";
import prisma from "../../utils/prisma";
import * as bcrypt from "bcrypt";
import config from "../../config/config";
import APIError from "../../errors/APIError";
import httpStatus from "http-status";
import { UserStatus } from "@prisma/client";

const loginUser = async (payload: { identifier: string; password: string }) => {
  let userData = await prisma.user.findUnique({
    where: {
      email: payload.identifier,
      status: UserStatus.ACTIVE,
    },
  });

  if (!userData) {
    userData = await prisma.user.findUnique({
      where: {
        username: payload.identifier,
        status: UserStatus.ACTIVE,
      },
    });
  }

  if (!userData) {
    throw new APIError(httpStatus.NOT_FOUND, "User not found!");
  }

  const isCorrectPassword: boolean = await bcrypt.compare(
    payload.password,
    userData.password
  );

  if (!isCorrectPassword) {
    throw new Error("Password incorrect!");
  }

  const accessToken = jwtHelpers.generateToken(
    {
      email: userData.email,
      username: userData.username,
      userId: userData.id,
      role: userData.role,
    },
    config.jwt.access_token_secret as Secret,
    config.jwt.access_token_expires_in as string
  );

  const refreshToken = jwtHelpers.generateToken(
    {
      email: userData.email,
      username: userData.username,
      userId: userData.id,
    },
    config.jwt.refresh_token_secret as Secret,
    config.jwt.refresh_token_expires_in as string
  );

  return {
    accessToken,
    refreshToken,
    userData,
  };
};

const refreshToken = async (token: string) => {
  let decodedData;
  try {
    decodedData = jwtHelpers.verifyToken(
      token,
      config.jwt.refresh_token_secret as Secret
    );
  } catch (err) {
    throw new Error("You are not authorized!");
  }

  const userData = await prisma.user.findUniqueOrThrow({
    where: {
      email: decodedData.email,
    },
  });

  const accessToken = jwtHelpers.generateToken(
    {
      email: userData.email,
      role: userData.role,
    },
    config.jwt.access_token_secret as Secret,
    config.jwt.access_token_expires_in as string
  );

  return {
    accessToken,
  };
};

export const authServices = {
  loginUser,
  refreshToken,
};
