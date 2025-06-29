import express from "express";
import auth from "../../middlewares/auth";
import { propertyControllers } from "./property.controller";
import validateRequest from "../../middlewares/validateRequest";
import { propertyValidationSchemas } from "./property.validation";
import { UserRole } from "@prisma/client";

const router = express.Router();

router.get("/", propertyControllers.getAllProperties);

router.get("/:propertyId", propertyControllers.getSingleProperty);

router.get(
  "/my-properties",
  auth(UserRole.USER, UserRole.ADMIN),
  propertyControllers.getMyProperties
);

router.post(
  "/",
  auth(UserRole.USER, UserRole.AGENT, UserRole.ADMIN),
  validateRequest(propertyValidationSchemas.createPropertySchema),
  propertyControllers.createProperty
);

router.put(
  "/:propertyId",
  auth(UserRole.ADMIN, UserRole.USER),
  validateRequest(propertyValidationSchemas.updatePropertySchema),
  propertyControllers.updateProperty
);

router.delete(
  "/:propertyId",
  auth(UserRole.ADMIN, UserRole.USER),
  propertyControllers.deleteProperty
);

export const propertyRoutes = router;
