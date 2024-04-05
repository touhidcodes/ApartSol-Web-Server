"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const http_status_1 = __importDefault(require("http-status"));
const zod_1 = require("zod");
const globalErrorHandler = (err, req, res, next) => {
    let message = err.message || "Something went wrong!";
    if (err instanceof zod_1.ZodError) {
        message = err.issues[0].message;
    }
    else if (err.name === "TokenExpiredError") {
        message = "Unauthorized Access!";
    }
    res.status(http_status_1.default.INTERNAL_SERVER_ERROR).json({
        success: false,
        message,
        errorDetails: err,
    });
};
exports.default = globalErrorHandler;
