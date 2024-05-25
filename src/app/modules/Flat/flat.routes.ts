import express from "express";
import auth from "../../middlewares/auth";
import { flatControllers } from "./flat.controller";
import validateRequest from "../../middlewares/validateRequest";
import { flatValidationSchemas } from "./flat.validation";

const router = express.Router();

router.get("/flats", flatControllers.getFlats);

router.get("/flats/:flatId", flatControllers.getSingleFlat);

router.post(
  "/flats",
  auth(),
  validateRequest(flatValidationSchemas.createFlatSchema),
  flatControllers.createFlat
);

router.put(
  "/flats/:flatId",
  auth(),
  validateRequest(flatValidationSchemas.updateFlatSchema),
  flatControllers.updateFlat
);

export const flatRoutes = router;
