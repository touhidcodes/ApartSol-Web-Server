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
exports.bookingServices = void 0;
const prisma_1 = __importDefault(require("../../utils/prisma"));
const getBooking = () => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield prisma_1.default.booking.findMany();
    return result;
});
const bookingRequest = (userId, flatId) => __awaiter(void 0, void 0, void 0, function* () {
    const bookingRequestData = {
        userId,
        flatId,
    };
    const result = yield prisma_1.default.booking.create({
        data: bookingRequestData,
    });
    return result;
});
const updateBooking = (bookingId, bookingData) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield prisma_1.default.booking.update({
        where: {
            id: bookingId,
        },
        data: bookingData,
    });
    return result;
});
exports.bookingServices = {
    bookingRequest,
    getBooking,
    updateBooking,
};
