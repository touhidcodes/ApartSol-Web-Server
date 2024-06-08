"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authRoutes = void 0;
const express_1 = __importDefault(require("express"));
const auth_controller_1 = require("./auth.controller");
const client_1 = require("@prisma/client");
const validateRequest_1 = __importDefault(require("../../middlewares/validateRequest"));
const auth_validation_1 = require("./auth.validation");
const auth_1 = __importDefault(require("../../middlewares/auth"));
const router = express_1.default.Router();
router.post("/login", auth_controller_1.authControllers.loginUser);
router.post("/refresh-token", auth_controller_1.authControllers.refreshToken);
router.post("/change-password", (0, validateRequest_1.default)(auth_validation_1.AuthValidation.changePasswordZodSchema), (0, auth_1.default)(client_1.UserRole.ADMIN, client_1.UserRole.USER), auth_controller_1.authControllers.changePassword);
exports.authRoutes = router;
