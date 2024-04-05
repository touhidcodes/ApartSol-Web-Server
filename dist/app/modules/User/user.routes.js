"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.userRoutes = void 0;
const express_1 = __importDefault(require("express"));
const user_controller_1 = require("./user.controller");
const auth_1 = __importDefault(require("../../middlewares/auth"));
const validateRequest_1 = __importDefault(require("../../middlewares/validateRequest"));
const user_validation_1 = require("./user.validation");
const router = express_1.default.Router();
router.post("/register", (0, validateRequest_1.default)(user_validation_1.userValidationSchema.createUserSchema), user_controller_1.userControllers.createUser);
router.get("/profile", (0, auth_1.default)(), user_controller_1.userControllers.getUser);
router.put("/profile", (0, auth_1.default)(), (0, validateRequest_1.default)(user_validation_1.userValidationSchema.updateUserSchema), user_controller_1.userControllers.updateUser);
exports.userRoutes = router;
