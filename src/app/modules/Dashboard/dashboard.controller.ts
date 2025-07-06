import httpStatus from "http-status";
import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import { dashboardServices } from "./dashboard.service";

// Basic user & post stats
const getUserRegistrationTrends = catchAsync(async (req, res) => {
  const result = await dashboardServices.getUserRegistrationTrends();
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "User registration trends retrieved successfully!",
    data: result,
  });
});

const monthlyTotalUsers = catchAsync(async (req, res) => {
  const result = await dashboardServices.monthlyTotalUsers();
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Monthly total users retrieved successfully!",
    data: result,
  });
});

const getUserByRole = catchAsync(async (req, res) => {
  const result = await dashboardServices.getUserByRole();
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "User role distribution retrieved successfully!",
    data: result,
  });
});

const totalUser = catchAsync(async (req, res) => {
  const result = await dashboardServices.totalUser();
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Total users count retrieved successfully!",
    data: result,
  });
});

const totalPost = catchAsync(async (req, res) => {
  const result = await dashboardServices.totalPost();
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Total posts count retrieved successfully!",
    data: result,
  });
});

const totalBookings = catchAsync(async (req, res) => {
  const result = await dashboardServices.totalBookings();
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Total bookings count retrieved successfully!",
    data: result,
  });
});

const totalBookingsByUser = catchAsync(async (req, res) => {
  const { userId } = req.user;
  const result = await dashboardServices.totalBookingsByUser(userId);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Total user bookings retrieved successfully!",
    data: result,
  });
});

const bookingsByUser = catchAsync(async (req, res) => {
  const { userId } = req.user;
  const result = await dashboardServices.bookingsByUser(userId);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "User booking trends retrieved successfully!",
    data: result,
  });
});

const totalFlatPostByUser = catchAsync(async (req, res) => {
  const { userId } = req.user;
  const result = await dashboardServices.totalFlatPostByUser(userId);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "User total posts retrieved successfully!",
    data: result,
  });
});

const flatPostByUser = catchAsync(async (req, res) => {
  const { userId } = req.user;
  const result = await dashboardServices.flatPostByUser(userId);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "User post trends retrieved successfully!",
    data: result,
  });
});

// Additional dashboard analytics
const getPropertyTypesDistribution = catchAsync(async (req, res) => {
  const result = await dashboardServices.getPropertyTypesDistribution();
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Property type distribution retrieved successfully!",
    data: result,
  });
});

const getMonthlySalesData = catchAsync(async (req, res) => {
  const result = await dashboardServices.getMonthlySalesData();
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Monthly sales data retrieved successfully!",
    data: result,
  });
});

const getRecentProperties = catchAsync(async (req, res) => {
  const result = await dashboardServices.getRecentProperties();
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Recent properties retrieved successfully!",
    data: result,
  });
});

const getRecentBookings = catchAsync(async (req, res) => {
  const result = await dashboardServices.getRecentBookings();
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Recent bookings retrieved successfully!",
    data: result,
  });
});

const getTopLocations = catchAsync(async (req, res) => {
  const result = await dashboardServices.getTopLocations();
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Top locations retrieved successfully!",
    data: result,
  });
});

const getTotalRevenue = catchAsync(async (req, res) => {
  const result = await dashboardServices.getTotalRevenue();
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Total revenue retrieved successfully!",
    data: result,
  });
});

const getMonthlyRevenueGrowth = catchAsync(async (req, res) => {
  const result = await dashboardServices.getMonthlyRevenueGrowth();
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Monthly revenue growth retrieved successfully!",
    data: result,
  });
});

const getUserGrowthStats = catchAsync(async (req, res) => {
  const result = await dashboardServices.getUserGrowthStats();
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "User growth stats retrieved successfully!",
    data: result,
  });
});

const getPropertyGrowthStats = catchAsync(async (req, res) => {
  const result = await dashboardServices.getPropertyGrowthStats();
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Property growth stats retrieved successfully!",
    data: result,
  });
});

const getMonthlyRevenueBreakdown = catchAsync(async (req, res) => {
  const result = await dashboardServices.getMonthlyRevenueBreakdown();
  console.log(result);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Monthly revenue breakdown retrieved successfully!",
    data: result,
  });
});

const getAdminDashboardStats = catchAsync(async (req, res) => {
  const result = await dashboardServices.getAdminDashboardStats();
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Admin dashboard stats retrieved successfully!",
    data: result,
  });
});

const getUserDashboardStats = catchAsync(async (req, res) => {
  const { userId } = req.user;
  const result = await dashboardServices.getUserDashboardStats(userId);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "User dashboard stats retrieved successfully!",
    data: result,
  });
});

const getBookingStatusDistribution = catchAsync(async (req, res) => {
  const result = await dashboardServices.getBookingStatusDistribution();
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Booking status distribution retrieved successfully!",
    data: result,
  });
});

const getPaymentMethodDistribution = catchAsync(async (req, res) => {
  const result = await dashboardServices.getPaymentMethodDistribution();
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Payment method distribution retrieved successfully!",
    data: result,
  });
});

const getUserStatusDistribution = catchAsync(async (req, res) => {
  const result = await dashboardServices.getUserStatusDistribution();
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "User status distribution retrieved successfully!",
    data: result,
  });
});

const getUserPropertyTypesDistribution = catchAsync(async (req, res) => {
  const { userId } = req.user;

  const result = await dashboardServices.getUserPropertyTypesDistribution(
    userId
  );

  sendResponse(res, {
    success: true,
    statusCode: 200,
    message: "User property types distribution retrieved successfully",
    data: result,
  });
});

const getUserMonthlySalesData = catchAsync(async (req, res) => {
  const { userId } = req.user;

  const result = await dashboardServices.getUserMonthlySalesData(userId);

  sendResponse(res, {
    success: true,
    statusCode: 200,
    message: "User monthly sales data retrieved successfully",
    data: result,
  });
});

const getUserRecentProperties = catchAsync(async (req, res) => {
  const { userId } = req.user;
  const limit = parseInt(req.query.limit as string) || 10;

  const result = await dashboardServices.getUserRecentProperties(userId, limit);

  sendResponse(res, {
    success: true,
    statusCode: 200,
    message: "User recent properties retrieved successfully",
    data: result,
  });
});

const getUserRecentBookings = catchAsync(async (req, res) => {
  const { userId } = req.user;
  const limit = parseInt(req.query.limit as string) || 10;

  const result = await dashboardServices.getUserRecentBookings(userId, limit);

  sendResponse(res, {
    success: true,
    statusCode: 200,
    message: "User recent bookings retrieved successfully",
    data: result,
  });
});

const getUserMonthlyRevenueBreakdown = catchAsync(async (req, res) => {
  const { userId } = req.user;

  const result = await dashboardServices.getUserMonthlyRevenueBreakdown(userId);

  sendResponse(res, {
    success: true,
    statusCode: 200,
    message: "User monthly revenue breakdown retrieved successfully",
    data: result,
  });
});

const getUserPropertyBookingTrends = catchAsync(async (req, res) => {
  const { userId } = req.user;

  const result = await dashboardServices.getUserPropertyBookingTrends(userId);

  sendResponse(res, {
    success: true,
    statusCode: 200,
    message: "User property booking trends retrieved successfully",
    data: result,
  });
});

const getUserTotalRevenue = catchAsync(async (req, res) => {
  const { userId } = req.user;

  const result = await dashboardServices.getUserTotalRevenue(userId);

  sendResponse(res, {
    success: true,
    statusCode: 200,
    message: "User total revenue retrieved successfully",
    data: result,
  });
});

const getUserMonthlyRevenueGrowth = catchAsync(async (req, res) => {
  const { userId } = req.user;

  const result = await dashboardServices.getUserMonthlyRevenueGrowth(userId);

  sendResponse(res, {
    success: true,
    statusCode: 200,
    message: "User monthly revenue growth retrieved successfully",
    data: result,
  });
});

// EXPORT
export const dashboardControllers = {
  getUserRegistrationTrends,
  monthlyTotalUsers,
  getUserByRole,
  totalUser,
  totalPost,
  totalBookings,
  totalBookingsByUser,
  bookingsByUser,
  totalFlatPostByUser,
  flatPostByUser,

  // New controllers
  getPropertyTypesDistribution,
  getMonthlySalesData,
  getRecentProperties,
  getRecentBookings,
  getTopLocations,
  getTotalRevenue,
  getMonthlyRevenueGrowth,
  getUserGrowthStats,
  getPropertyGrowthStats,
  getMonthlyRevenueBreakdown,
  getAdminDashboardStats,
  getUserDashboardStats,
  getBookingStatusDistribution,
  getPaymentMethodDistribution,
  getUserStatusDistribution,

  // NEW: User-specific controller functions
  getUserPropertyTypesDistribution,
  getUserMonthlySalesData,
  getUserRecentProperties,
  getUserRecentBookings,
  getUserMonthlyRevenueBreakdown,
  getUserPropertyBookingTrends,
  getUserTotalRevenue,
  getUserMonthlyRevenueGrowth,
};
