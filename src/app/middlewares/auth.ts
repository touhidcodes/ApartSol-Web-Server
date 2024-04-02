import { NextFunction, RequestHandler } from "express";
import httpStatus from "http-status";
import { jwtHelpers } from "../utils/jwtHelpers";
import config from "../config/config";
import { Secret } from "jsonwebtoken";
import APIError from "../errors/APIError";
import catchAsync from "../utils/catchAsync";

const auth = () => {
  return catchAsync(async (req, res, next) => {
    try {
      const token = req.headers.authorization as string;

      if (!token) {
        throw new APIError(httpStatus.UNAUTHORIZED, "You are not authorized!");
      }

      const verifiedUser = jwtHelpers.verifyToken(
        token,
        config.jwt.access_token_secret as Secret
      );

      req.user = verifiedUser;
      console.log(verifiedUser);

      //   if (roles.length && !roles.includes(verifiedUser.role)) {
      //     throw new ApiError(httpStatus.FORBIDDEN, "Forbidden!");
      //   }
      next();
    } catch (err) {
      next(err);
    }
  });
};

export default auth;
