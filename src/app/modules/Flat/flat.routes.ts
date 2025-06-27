import express from "express";
import auth from "../../middlewares/auth";
import { flatControllers } from "./flat.controller";
import validateRequest from "../../middlewares/validateRequest";
import { flatValidationSchemas } from "./flat.validation";
import { UserRole } from "@prisma/client";

const router = express.Router();

router.get("/", flatControllers.getFlats);

router.get("/:flatId", flatControllers.getSingleFlat);

router.get(
  "/my-flats",
  auth(UserRole.USER, UserRole.ADMIN),
  flatControllers.getMyFlats
);

router.post(
  "/",
  auth(UserRole.AGENT, UserRole.ADMIN),
  validateRequest(flatValidationSchemas.createFlatSchema),
  flatControllers.createFlat
);

router.put(
  "/:flatId",
  auth(UserRole.ADMIN, UserRole.USER),
  validateRequest(flatValidationSchemas.updateFlatSchema),
  flatControllers.updateFlat
);

router.delete(
  "/:flatId",
  auth(UserRole.ADMIN, UserRole.USER),
  flatControllers.deleteFlat
);

export const flatRoutes = router;
