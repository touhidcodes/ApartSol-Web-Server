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
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.flatServices = void 0;
const prisma_1 = __importDefault(require("../../utils/prisma"));
const paginationHelpers_1 = require("../../utils/paginationHelpers");
const flat_constants_1 = require("./flat.constants");
const createFlat = (flatData, userId) => __awaiter(void 0, void 0, void 0, function* () {
    const data = Object.assign(Object.assign({}, flatData), { userId });
    const result = yield prisma_1.default.flat.create({
        data: data,
    });
    return result;
});
const getFlats = (params, options) => __awaiter(void 0, void 0, void 0, function* () {
    const { page, limit, skip } = paginationHelpers_1.paginationHelper.calculatePagination(options);
    const { searchTerm, availability } = params, filterData = __rest(params, ["searchTerm", "availability"]);
    const andConditions = [];
    if (params.searchTerm) {
        andConditions.push({
            OR: flat_constants_1.flatSearchableFields.map((field) => ({
                [field]: {
                    contains: params.searchTerm,
                    mode: "insensitive",
                },
            })),
        });
    }
    // Add condition for availability because it have boolean value
    if (availability) {
        const availabilityFilter = params.availability === "true" ? true : false;
        andConditions.push({
            availability: availabilityFilter,
        });
    }
    if (Object.keys(filterData).length > 0) {
        andConditions.push({
            AND: Object.keys(filterData).map((key) => ({
                [key]: {
                    equals: filterData[key],
                },
            })),
        });
    }
    const whereConditions = andConditions.length > 0 ? { AND: andConditions } : {};
    const result = yield prisma_1.default.flat.findMany({
        where: whereConditions,
        skip,
        take: limit,
        orderBy: options.sortBy && options.sortOrder
            ? {
                [options.sortBy]: options.sortOrder,
            }
            : {
                createdAt: "desc",
            },
    });
    const total = yield prisma_1.default.flat.count({
        where: whereConditions,
    });
    console.log(result);
    return {
        meta: {
            page,
            limit,
            total,
        },
        data: result,
    };
});
const getSingleFlat = (flatId) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield prisma_1.default.flat.findUniqueOrThrow({
        where: {
            id: flatId,
            availability: true,
        },
    });
    return result;
});
const getMyFlats = (userId) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield prisma_1.default.flat.findMany({
        where: {
            userId: userId,
            availability: true,
        },
    });
    return result;
});
const updateFlat = (flatId, flatData) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield prisma_1.default.flat.update({
        where: {
            id: flatId,
        },
        data: flatData,
    });
    return result;
});
const deleteFlat = (flatId) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield prisma_1.default.flat.update({
        where: {
            id: flatId,
        },
        data: {
            availability: false,
        },
    });
    return result;
});
exports.flatServices = {
    createFlat,
    getFlats,
    updateFlat,
    getSingleFlat,
    getMyFlats,
    deleteFlat,
};
