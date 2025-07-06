import prisma from "../../utils/prisma";
import moment from "moment";

const getUserRegistrationTrends = async () => {
  const startDate = moment().subtract(6, "months").startOf("month").toDate();
  const endDate = moment().endOf("month").toDate();

  // Get users grouped by month
  const users = await prisma.user.findMany({
    where: {
      createdAt: {
        gte: startDate,
        lte: endDate,
      },
    },
    select: {
      createdAt: true,
    },
    orderBy: {
      createdAt: "asc",
    },
  });

  // Group by month and count
  const monthlyData = users.reduce((acc, user) => {
    const month = moment(user.createdAt).format("MMM");
    acc[month] = (acc[month] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  // Convert to array format
  const result = Object.entries(monthlyData).map(([date, count]) => ({
    date,
    count,
  }));

  return result;
};

const monthlyTotalUsers = async () => {
  const startDate = moment().startOf("month").toDate();
  const endDate = moment().endOf("month").toDate();

  const totalUsersCount = await prisma.user.count({
    where: {
      createdAt: {
        gte: startDate,
        lte: endDate,
      },
    },
  });

  return {
    month: moment().format("YYYY-MM"),
    count: totalUsersCount,
  };
};

const getUserByRole = async () => {
  const data = await prisma.user.groupBy({
    by: ["role"],
    _count: {
      id: true,
    },
    orderBy: {
      role: "asc",
    },
  });

  const result = data.map((item) => ({
    name: item.role,
    count: item._count.id,
  }));

  return result;
};

const totalUser = async () => {
  const result = await prisma.user.count();
  return result;
};

const totalBookings = async () => {
  const result = await prisma.booking.count();
  return result;
};

const totalPost = async () => {
  const result = await prisma.property.count();
  return result;
};

const totalBookingsByUser = async (userId: string) => {
  const result = await prisma.booking.count({
    where: {
      userId: userId,
    },
  });

  return result;
};

const bookingsByUser = async (userId: string) => {
  const startDate = moment().subtract(6, "months").startOf("month").toDate();
  const endDate = moment().endOf("month").toDate();

  const bookings = await prisma.booking.findMany({
    where: {
      userId: userId,
      createdAt: {
        gte: startDate,
        lte: endDate,
      },
    },
    select: {
      createdAt: true,
    },
    orderBy: {
      createdAt: "asc",
    },
  });

  // Group by month and count
  const monthlyData = bookings.reduce((acc, booking) => {
    const month = moment(booking.createdAt).format("MMM");
    acc[month] = (acc[month] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  // Convert to array format
  const result = Object.entries(monthlyData).map(([date, count]) => ({
    date,
    count,
  }));

  return result;
};

const totalFlatPostByUser = async (userId: string) => {
  const result = await prisma.property.count({
    where: {
      userId: userId,
    },
  });

  return result;
};

const flatPostByUser = async (userId: string) => {
  const startDate = moment().subtract(6, "months").startOf("month").toDate();
  const endDate = moment().endOf("month").toDate();

  const properties = await prisma.property.findMany({
    where: {
      userId: userId,
      createdAt: {
        gte: startDate,
        lte: endDate,
      },
    },
    select: {
      createdAt: true,
    },
    orderBy: {
      createdAt: "asc",
    },
  });

  // Group by month and count
  const monthlyData = properties.reduce((acc, property) => {
    const month = moment(property.createdAt).format("MMM");
    acc[month] = (acc[month] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  // Convert to array format
  const result = Object.entries(monthlyData).map(([date, count]) => ({
    date,
    count,
  }));

  return result;
};

// NEW FUNCTIONS TO MATCH DASHBOARD DATA

// Get property types distribution
const getPropertyTypesDistribution = async () => {
  const data = await prisma.property.groupBy({
    by: ["propertyType"],
    _count: {
      id: true,
    },
    orderBy: {
      propertyType: "asc",
    },
  });

  const result = data.map((item) => ({
    name: item.propertyType,
    count: item._count.id,
  }));

  return result;
};

// Get monthly sales data (rent vs sale)
const getMonthlySalesData = async () => {
  const last6Months = Array.from({ length: 6 }, (_, i) =>
    moment().subtract(i, "months")
  ).reverse();

  const result = await Promise.all(
    last6Months.map(async (month) => {
      const startDate = month.startOf("month").toDate();
      const endDate = month.endOf("month").toDate();

      const [saleProperties, rentProperties, totalBookings] = await Promise.all(
        [
          prisma.property.count({
            where: {
              purpose: "SALE",
              createdAt: { gte: startDate, lte: endDate },
            },
          }),
          prisma.property.count({
            where: {
              purpose: "RENT",
              createdAt: { gte: startDate, lte: endDate },
            },
          }),
          prisma.booking.count({
            where: {
              createdAt: { gte: startDate, lte: endDate },
            },
          }),
        ]
      );

      return {
        month: month.format("MMM"),
        buy: totalBookings, // bookings can represent purchases
        sell: saleProperties,
        rent: rentProperties,
      };
    })
  );

  return result;
};

// Get recent properties
const getRecentProperties = async (limit: number = 10) => {
  const properties = await prisma.property.findMany({
    take: limit,
    where: {
      isDeleted: false,
    },
    orderBy: {
      createdAt: "desc",
    },
    include: {
      user: {
        include: {
          userProfile: {
            select: {
              name: true,
            },
          },
        },
      },
    },
  });

  return properties.map((property) => ({
    id: property.id,
    title: property.title,
    type: property.propertyType,
    price: `$${property.price.toLocaleString()}`,
    status: property.purpose === "SALE" ? "For Sale" : "For Rent",
    location: `${property.city || ""}, ${property.state || ""}`
      .trim()
      .replace(/^,\s*/, ""),
    date: moment(property.createdAt).format("YYYY-MM-DD"),
    owner: property.user.userProfile?.name || property.user.username,
  }));
};

// Get recent bookings
const getRecentBookings = async (limit: number = 10) => {
  const bookings = await prisma.booking.findMany({
    take: limit,
    orderBy: {
      createdAt: "desc",
    },
    include: {
      property: {
        select: {
          title: true,
          price: true,
        },
      },
      user: {
        include: {
          userProfile: {
            select: {
              name: true,
            },
          },
        },
      },
    },
  });

  return bookings.map((booking) => ({
    id: booking.id,
    property: booking.property.title,
    client: booking.user.userProfile?.name || booking.user.username,
    date: moment(booking.createdAt).format("YYYY-MM-DD"),
    status: booking.status,
    amount: `$${booking.totalAmount.toLocaleString()}`,
  }));
};

// Get top locations by property count
const getTopLocations = async (limit: number = 10) => {
  const properties = await prisma.property.findMany({
    where: {
      isDeleted: false,
      city: { not: null },
    },
    select: {
      city: true,
      price: true,
    },
  });

  // Group by city and calculate stats
  const cityStats = properties.reduce((acc, property) => {
    const city = property.city!;
    if (!acc[city]) {
      acc[city] = {
        count: 0,
        totalPrice: 0,
      };
    }
    acc[city].count += 1;
    acc[city].totalPrice += property.price;
    return acc;
  }, {} as Record<string, { count: number; totalPrice: number }>);

  // Convert to array and sort by count
  const result = Object.entries(cityStats)
    .map(([city, stats]) => ({
      city,
      properties: stats.count,
      avgPrice: `$${Math.round(
        stats.totalPrice / stats.count
      ).toLocaleString()}`,
    }))
    .sort((a, b) => b.properties - a.properties)
    .slice(0, limit);

  return result;
};

// Get total revenue from completed payments
const getTotalRevenue = async () => {
  const result = await prisma.payment.aggregate({
    _sum: {
      finalAmount: true,
    },
    where: {
      status: "COMPLETED",
    },
  });

  return result._sum.finalAmount || 0;
};

// Get monthly revenue growth
const getMonthlyRevenueGrowth = async () => {
  const currentMonth = moment().startOf("month").toDate();
  const nextMonth = moment().add(1, "month").startOf("month").toDate();
  const previousMonth = moment().subtract(1, "month").startOf("month").toDate();

  const [currentRevenue, previousRevenue] = await Promise.all([
    prisma.payment.aggregate({
      _sum: { finalAmount: true },
      where: {
        status: "COMPLETED",
        createdAt: { gte: currentMonth, lt: nextMonth },
      },
    }),
    prisma.payment.aggregate({
      _sum: { finalAmount: true },
      where: {
        status: "COMPLETED",
        createdAt: { gte: previousMonth, lt: currentMonth },
      },
    }),
  ]);

  const current = currentRevenue._sum.finalAmount || 0;
  const previous = previousRevenue._sum.finalAmount || 0;
  const growth = previous > 0 ? ((current - previous) / previous) * 100 : 0;

  return {
    current,
    previous,
    growth: Math.round(growth),
  };
};

// Get user growth statistics
const getUserGrowthStats = async () => {
  const currentMonth = moment().startOf("month").toDate();
  const nextMonth = moment().add(1, "month").startOf("month").toDate();
  const previousMonth = moment().subtract(1, "month").startOf("month").toDate();

  const [currentUsers, previousUsers] = await Promise.all([
    prisma.user.count({
      where: {
        createdAt: { gte: currentMonth, lt: nextMonth },
      },
    }),
    prisma.user.count({
      where: {
        createdAt: { gte: previousMonth, lt: currentMonth },
      },
    }),
  ]);

  const growth =
    previousUsers > 0
      ? ((currentUsers - previousUsers) / previousUsers) * 100
      : 0;

  return {
    current: currentUsers,
    previous: previousUsers,
    growth: Math.round(growth),
  };
};

// Get property growth statistics
const getPropertyGrowthStats = async () => {
  const currentMonth = moment().startOf("month").toDate();
  const nextMonth = moment().add(1, "month").startOf("month").toDate();
  const previousMonth = moment().subtract(1, "month").startOf("month").toDate();

  const [currentProperties, previousProperties] = await Promise.all([
    prisma.property.count({
      where: {
        createdAt: { gte: currentMonth, lt: nextMonth },
        isDeleted: false,
      },
    }),
    prisma.property.count({
      where: {
        createdAt: { gte: previousMonth, lt: currentMonth },
        isDeleted: false,
      },
    }),
  ]);

  const growth =
    previousProperties > 0
      ? ((currentProperties - previousProperties) / previousProperties) * 100
      : 0;

  return {
    current: currentProperties,
    previous: previousProperties,
    growth: Math.round(growth),
  };
};

// Get monthly revenue breakdown by property type
const getMonthlyRevenueBreakdown = async () => {
  const currentMonth = moment().startOf("month").toDate();
  const nextMonth = moment().add(1, "month").startOf("month").toDate();

  const payments = await prisma.payment.findMany({
    where: {
      status: "COMPLETED",
      createdAt: {
        gte: currentMonth,
        lt: nextMonth,
      },
    },
    include: {
      booking: {
        include: {
          property: {
            select: {
              propertyType: true,
            },
          },
        },
      },
    },
  });

  // Group by property type
  const revenueByType = payments.reduce((acc, payment) => {
    const type = payment.booking.property.propertyType;
    acc[type] = (acc[type] || 0) + payment.finalAmount;
    return acc;
  }, {} as Record<string, number>);

  return Object.entries(revenueByType).map(([type, revenue]) => ({
    type,
    revenue,
  }));
};

// Get dashboard statistics for admin
const getAdminDashboardStats = async () => {
  const [
    totalProperties,
    totalRevenue,
    totalUsers,
    revenueGrowth,
    userGrowth,
    propertyGrowth,
  ] = await Promise.all([
    totalPost(),
    getTotalRevenue(),
    totalUser(),
    getMonthlyRevenueGrowth(),
    getUserGrowthStats(),
    getPropertyGrowthStats(),
  ]);

  return {
    totalProperties,
    totalRevenue,
    totalUsers,
    revenueGrowth: revenueGrowth.growth,
    userGrowth: userGrowth.growth,
    propertyGrowth: propertyGrowth.growth,
  };
};

// Get dashboard statistics for user
const getUserDashboardStats = async (userId: string) => {
  const [myProperties, myBookings, totalPropertyValue, completedBookings] =
    await Promise.all([
      totalFlatPostByUser(userId),
      totalBookingsByUser(userId),
      prisma.property.aggregate({
        _sum: { price: true },
        where: { userId, isDeleted: false },
      }),
      prisma.booking.count({
        where: { userId, status: "COMPLETED" },
      }),
    ]);

  return {
    myProperties,
    myBookings,
    totalPropertyValue: totalPropertyValue._sum.price || 0,
    completedBookings,
  };
};

// Get booking status distribution
const getBookingStatusDistribution = async () => {
  const data = await prisma.booking.groupBy({
    by: ["status"],
    _count: {
      id: true,
    },
    orderBy: {
      status: "asc",
    },
  });

  return data.map((item) => ({
    status: item.status,
    count: item._count.id,
  }));
};

// Get payment method distribution
const getPaymentMethodDistribution = async () => {
  const data = await prisma.payment.groupBy({
    by: ["paymentMethod"],
    _count: {
      id: true,
    },
    orderBy: {
      paymentMethod: "asc",
    },
  });

  return data.map((item) => ({
    method: item.paymentMethod,
    count: item._count.id,
  }));
};

// Get active vs inactive users
const getUserStatusDistribution = async () => {
  const data = await prisma.user.groupBy({
    by: ["status"],
    _count: {
      id: true,
    },
    orderBy: {
      status: "asc",
    },
  });

  return data.map((item) => ({
    status: item.status,
    count: item._count.id,
  }));
};

// Add these new functions to your existing dashboardServices

// User-specific property types distribution
const getUserPropertyTypesDistribution = async (userId: string) => {
  const data = await prisma.property.groupBy({
    by: ["propertyType"],
    where: {
      userId: userId,
      isDeleted: false,
    },
    _count: {
      id: true,
    },
    orderBy: {
      propertyType: "asc",
    },
  });

  const result = data.map((item) => ({
    name: item.propertyType,
    count: item._count.id,
  }));

  return result;
};

// User-specific monthly sales data (user's properties)
const getUserMonthlySalesData = async (userId: string) => {
  const last6Months = Array.from({ length: 6 }, (_, i) =>
    moment().subtract(i, "months")
  ).reverse();

  const result = await Promise.all(
    last6Months.map(async (month) => {
      const startDate = month.startOf("month").toDate();
      const endDate = month.endOf("month").toDate();

      const [saleProperties, rentProperties, userBookings] = await Promise.all([
        prisma.property.count({
          where: {
            userId: userId,
            purpose: "SALE",
            createdAt: { gte: startDate, lte: endDate },
            isDeleted: false,
          },
        }),
        prisma.property.count({
          where: {
            userId: userId,
            purpose: "RENT",
            createdAt: { gte: startDate, lte: endDate },
            isDeleted: false,
          },
        }),
        prisma.booking.count({
          where: {
            userId: userId,
            createdAt: { gte: startDate, lte: endDate },
          },
        }),
      ]);

      return {
        month: month.format("MMM"),
        buy: userBookings, // user's bookings
        sell: saleProperties, // user's sale properties
        rent: rentProperties, // user's rent properties
      };
    })
  );

  return result;
};

// User-specific recent properties (user's own properties)
const getUserRecentProperties = async (userId: string, limit: number = 10) => {
  const properties = await prisma.property.findMany({
    take: limit,
    where: {
      userId: userId,
      isDeleted: false,
    },
    orderBy: {
      createdAt: "desc",
    },
    include: {
      user: {
        include: {
          userProfile: {
            select: {
              name: true,
            },
          },
        },
      },
    },
  });

  return properties.map((property) => ({
    id: property.id,
    title: property.title,
    type: property.propertyType,
    price: `$${property.price.toLocaleString()}`,
    status: property.purpose === "SALE" ? "For Sale" : "For Rent",
    location: `${property.city || ""}, ${property.state || ""}`
      .trim()
      .replace(/^,\s*/, ""),
    date: moment(property.createdAt).format("YYYY-MM-DD"),
    owner: property.user.userProfile?.name || property.user.username,
  }));
};

// User-specific recent bookings (user's bookings)
const getUserRecentBookings = async (userId: string, limit: number = 10) => {
  const bookings = await prisma.booking.findMany({
    take: limit,
    where: {
      userId: userId,
    },
    orderBy: {
      createdAt: "desc",
    },
    include: {
      property: {
        select: {
          title: true,
          price: true,
        },
      },
      user: {
        include: {
          userProfile: {
            select: {
              name: true,
            },
          },
        },
      },
    },
  });

  return bookings.map((booking) => ({
    id: booking.id,
    property: booking.property.title,
    client: booking.user.userProfile?.name || booking.user.username,
    date: moment(booking.createdAt).format("YYYY-MM-DD"),
    status: booking.status,
    amount: `$${booking.totalAmount.toLocaleString()}`,
  }));
};

// User-specific revenue breakdown (from user's property bookings)
const getUserMonthlyRevenueBreakdown = async (userId: string) => {
  const currentMonth = moment().startOf("month").toDate();
  const nextMonth = moment().add(1, "month").startOf("month").toDate();

  const payments = await prisma.payment.findMany({
    where: {
      status: "COMPLETED",
      createdAt: {
        gte: currentMonth,
        lt: nextMonth,
      },
      booking: {
        property: {
          userId: userId,
        },
      },
    },
    include: {
      booking: {
        include: {
          property: {
            select: {
              propertyType: true,
            },
          },
        },
      },
    },
  });

  // Group by property type
  const revenueByType = payments.reduce((acc, payment) => {
    const type = payment.booking.property.propertyType;
    acc[type] = (acc[type] || 0) + payment.finalAmount;
    return acc;
  }, {} as Record<string, number>);

  return Object.entries(revenueByType).map(([type, revenue]) => ({
    type,
    revenue,
  }));
};

// User-specific property booking trends (bookings made on user's properties)
const getUserPropertyBookingTrends = async (userId: string) => {
  const startDate = moment().subtract(6, "months").startOf("month").toDate();
  const endDate = moment().endOf("month").toDate();

  const bookings = await prisma.booking.findMany({
    where: {
      property: {
        userId: userId,
      },
      createdAt: {
        gte: startDate,
        lte: endDate,
      },
    },
    select: {
      createdAt: true,
    },
    orderBy: {
      createdAt: "asc",
    },
  });

  // Group by month and count
  const monthlyData = bookings.reduce((acc, booking) => {
    const month = moment(booking.createdAt).format("MMM");
    acc[month] = (acc[month] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  // Convert to array format
  const result = Object.entries(monthlyData).map(([date, count]) => ({
    date,
    count,
  }));

  return result;
};

// User-specific total revenue from their properties
const getUserTotalRevenue = async (userId: string) => {
  const result = await prisma.payment.aggregate({
    _sum: {
      finalAmount: true,
    },
    where: {
      status: "COMPLETED",
      booking: {
        property: {
          userId: userId,
        },
      },
    },
  });

  return result._sum.finalAmount || 0;
};

// User-specific monthly revenue growth
const getUserMonthlyRevenueGrowth = async (userId: string) => {
  const currentMonth = moment().startOf("month").toDate();
  const nextMonth = moment().add(1, "month").startOf("month").toDate();
  const previousMonth = moment().subtract(1, "month").startOf("month").toDate();

  const [currentRevenue, previousRevenue] = await Promise.all([
    prisma.payment.aggregate({
      _sum: { finalAmount: true },
      where: {
        status: "COMPLETED",
        createdAt: { gte: currentMonth, lt: nextMonth },
        booking: {
          property: {
            userId: userId,
          },
        },
      },
    }),
    prisma.payment.aggregate({
      _sum: { finalAmount: true },
      where: {
        status: "COMPLETED",
        createdAt: { gte: previousMonth, lt: currentMonth },
        booking: {
          property: {
            userId: userId,
          },
        },
      },
    }),
  ]);

  const current = currentRevenue._sum.finalAmount || 0;
  const previous = previousRevenue._sum.finalAmount || 0;
  const growth = previous > 0 ? ((current - previous) / previous) * 100 : 0;

  return {
    current,
    previous,
    growth: Math.round(growth),
  };
};

// Export updated dashboardServices with new user-specific functions
export const dashboardServices = {
  // Original functions
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

  // Admin-only functions
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

  // NEW: User-specific functions
  getUserPropertyTypesDistribution,
  getUserMonthlySalesData,
  getUserRecentProperties,
  getUserRecentBookings,
  getUserMonthlyRevenueBreakdown,
  getUserPropertyBookingTrends,
  getUserTotalRevenue,
  getUserMonthlyRevenueGrowth,
};
