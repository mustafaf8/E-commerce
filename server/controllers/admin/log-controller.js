const Log = require("../../models/Log");
const { logInfo, logError } = require("../../helpers/logger");

// Logları getir
// GET /api/admin/logs - Tüm logları getir
const getLogs = async (req, res) => {
  try {
    const {
      page = 1,
      limit = 50,
      level,
      action,
      userId,
      startDate,
      endDate,
      search,
    } = req.query;

    const filter = {};

    if (level && ["info", "warn", "error", "debug"].includes(level)) {
      filter.level = level;
    }
    if (action) {
      filter["action"] = { $regex: action, $options: "i" };
    }
    if (userId) {
      filter["userId"] = userId;
    }
    if (startDate || endDate) {
      filter.timestamp = {};
      if (startDate) filter.timestamp.$gte = new Date(startDate);
      if (endDate) filter.timestamp.$lte = new Date(endDate);
    }
    if (search) {
      filter.$or = [
        { message: { $regex: search, $options: "i" } },
        { "username": { $regex: search, $options: "i" } },
        { "action": { $regex: search, $options: "i" } },
      ];
    }

    const skip = (parseInt(page) - 1) * parseInt(limit);
    const limitNum = parseInt(limit);

    // Logları getir (populate güncellendi)
    const logs = await Log.find(filter)
      .populate("userId", "username email") // Doğrudan 'userId' populate ediliyor
      .sort({ timestamp: -1 })
      .skip(skip)
      .limit(limitNum)
      .lean();

    const totalLogs = await Log.countDocuments(filter);
    const totalPages = Math.ceil(totalLogs / limitNum);

    // Logları formatla (meta referansları kaldırıldı)
    const formattedLogs = logs.map((log) => ({
      id: log._id,
      timestamp: log.timestamp,
      level: log.level,
      message: log.message,
      user: log.userId ? {
        id: log.userId._id,
        username: log.userId.username || log.userId.email,
      } : (log.username ? { username: log.username } : null),
      ipAddress: log.ipAddress,
      action: log.action,
      resourceId: log.resourceId,
      resourceType: log.resourceType,
      additionalData: log.additionalData,
      createdAt: log.createdAt,
      updatedAt: log.updatedAt,
    }));

    // Log görüntüleme işlemini logla
    console.log("LogController: req.user bilgisi:", {
      hasUser: !!req.user,
      userId: req.user?._id,
      username: req.user?.username || req.user?.email
    });
    
    logInfo("Loglar görüntülendi", req, {
      action: "VIEW_LOGS",
      filters: { level, action, userId, startDate, endDate, search },
      page,
      limit,
      totalResults: totalLogs,
      debug: {
        hasUser: !!req.user,
        userId: req.user?._id,
        username: req.user?.username || req.user?.email,
        ip: req.ip,
      }
    });

    res.status(200).json({
      success: true,
      data: {
        logs: formattedLogs,
        pagination: {
          currentPage: parseInt(page),
          totalPages,
          totalLogs,
          hasNextPage: parseInt(page) < totalPages,
          hasPrevPage: parseInt(page) > 1,
        },
      },
    });
  } catch (error) {
    logError("Log görüntüleme hatası", req, {
      action: "VIEW_LOGS_ERROR",
      error: error.message,
    });
    res.status(500).json({
      success: false,
      message: "Loglar alınırken bir hata oluştu.",
    });
  }
};

// Log istatistiklerini getir
const getLogStats = async (req, res) => {
  try {
    const { startDate, endDate } = req.query;

    // Tarih filtresi
    const dateFilter = {};
    if (startDate || endDate) {
      dateFilter.timestamp = {};
      if (startDate) {
        dateFilter.timestamp.$gte = new Date(startDate);
      }
      if (endDate) {
        dateFilter.timestamp.$lte = new Date(endDate);
      }
    }

    // Level bazında istatistikler
    const levelStats = await Log.aggregate([
      { $match: dateFilter },
      {
        $group: {
          _id: "$level",
          count: { $sum: 1 },
        },
      },
      { $sort: { count: -1 } },
    ]);

    // Action bazında istatistikler
    const actionStats = await Log.aggregate([
      { $match: { ...dateFilter, "meta.action": { $exists: true } } },
      {
        $group: {
          _id: "$meta.action",
          count: { $sum: 1 },
        },
      },
      { $sort: { count: -1 } },
      { $limit: 10 },
    ]);

    // Günlük log sayısı (son 30 gün)
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const dailyStats = await Log.aggregate([
      {
        $match: {
          timestamp: { $gte: thirtyDaysAgo },
          ...dateFilter,
        },
      },
      {
        $group: {
          _id: {
            $dateToString: { format: "%Y-%m-%d", date: "$timestamp" },
          },
          count: { $sum: 1 },
        },
      },
      { $sort: { _id: 1 } },
    ]);

    // Toplam log sayısı
    const totalLogs = await Log.countDocuments(dateFilter);

    logInfo("Log istatistikleri görüntülendi", req, {
      action: "VIEW_LOG_STATS",
      filters: { startDate, endDate },
    });

    res.status(200).json({
      success: true,
      data: {
        levelStats,
        actionStats,
        dailyStats,
        totalLogs,
      },
    });
  } catch (error) {
    logError("Log istatistikleri görüntüleme hatası", req, {
      action: "VIEW_LOG_STATS_ERROR",
      error: error.message,
    });

    res.status(500).json({
      success: false,
      message: "Log istatistikleri alınırken bir hata oluştu.",
    });
  }
};

// Belirli bir logu getir
const getLogById = async (req, res) => {
  try {
    const { id } = req.params;

    const log = await Log.findById(id)
      .populate("meta.userId", "username email")
      .lean();

    if (!log) {
      return res.status(404).json({
        success: false,
        message: "Log bulunamadı.",
      });
    }

    logInfo("Tekil log görüntülendi", req, {
      action: "VIEW_SINGLE_LOG",
      logId: id,
    });

    res.status(200).json({
      success: true,
      data: {
        id: log._id,
        timestamp: log.timestamp,
        level: log.level,
        message: log.message,
        user: log.meta?.userId ? {
          id: log.meta.userId._id,
          username: log.meta.userId.username || log.meta.userId.email,
        } : null,
        ipAddress: log.meta?.ipAddress,
        userAgent: log.meta?.userAgent,
        action: log.meta?.action,
        resourceId: log.meta?.resourceId,
        resourceType: log.meta?.resourceType,
        additionalData: log.meta?.additionalData,
        createdAt: log.createdAt,
        updatedAt: log.updatedAt,
      },
    });
  } catch (error) {
    logError("Tekil log görüntüleme hatası", req, {
      action: "VIEW_SINGLE_LOG_ERROR",
      logId: req.params.id,
      error: error.message,
    });

    res.status(500).json({
      success: false,
      message: "Log alınırken bir hata oluştu.",
    });
  }
};

module.exports = {
  getLogs,
  getLogStats,
  getLogById,
}; 