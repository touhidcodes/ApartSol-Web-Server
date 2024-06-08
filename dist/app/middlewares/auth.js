"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const http_status_1 = __importDefault(require("http-status"));
const jwtHelpers_1 = require("../utils/jwtHelpers");
const config_1 = __importDefault(require("../config/config"));
const APIError_1 = __importDefault(require("../errors/APIError"));
const catchAsync_1 = __importDefault(require("../utils/catchAsync"));
const prisma_1 = __importDefault(require("../utils/prisma"));
const auth = (...roles) => {
    return (0, catchAsync_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const token = req.headers.authorization;
            if (!token) {
                throw new APIError_1.default(http_status_1.default.UNAUTHORIZED, "Unauthorized Access!");
            }
            const decodedUser = jwtHelpers_1.jwtHelpers.verifyToken(token, config_1.default.jwt.access_token_secret);
            // Check if the user exists in the database
            const user = yield prisma_1.default.user.findUnique({
                where: { id: decodedUser.userId, email: decodedUser.email },
            });
            if (!user) {
                throw new APIError_1.default(http_status_1.default.UNAUTHORIZED, "Unauthorized Access!");
            }
            // Check if the token is expired
            const tokenExpirationDate = new Date(decodedUser.exp * 1000);
            if (tokenExpirationDate < new Date()) {
                throw new APIError_1.default(http_status_1.default.UNAUTHORIZED, "Unauthorized Access!!");
            }
            req.user = decodedUser;
            //  role based operations
            if (roles.length && !roles.includes(decodedUser.role)) {
                throw new APIError_1.default(http_status_1.default.FORBIDDEN, "Forbidden!");
            }
            next();
        }
        catch (err) {
            next(err);
        }
    }));
};
exports.default = auth;
