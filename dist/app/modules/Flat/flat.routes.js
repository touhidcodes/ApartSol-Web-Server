"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.flatRoutes = void 0;
const express_1 = __importDefault(require("express"));
const auth_1 = __importDefault(require("../../middlewares/auth"));
const flat_controller_1 = require("./flat.controller");
const validateRequest_1 = __importDefault(require("../../middlewares/validateRequest"));
const flat_validation_1 = require("./flat.validation");
const router = express_1.default.Router();
router.get("/flats", flat_controller_1.flatControllers.getFlats);
router.post("/flats", (0, auth_1.default)(), (0, validateRequest_1.default)(flat_validation_1.flatValidationSchemas.createFlatSchema), flat_controller_1.flatControllers.createFlat);
router.put("/flats/:flatId", (0, auth_1.default)(), (0, validateRequest_1.default)(flat_validation_1.flatValidationSchemas.updateFlatSchema), flat_controller_1.flatControllers.updateFlat);
exports.flatRoutes = router;
