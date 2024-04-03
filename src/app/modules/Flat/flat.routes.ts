import express from "express";
import auth from "../../middlewares/auth";
import { flatControllers } from "./flat.controller";

const router = express.Router();

router.post("/flats", auth(), flatControllers.createFlat);

export const flatRoutes = router;
