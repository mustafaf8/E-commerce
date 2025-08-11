const Log = require("../../models/Log");
const { logInfo, logError } = require("../../helpers/logger");

// Logları getir - GÜNCELLENDİ
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

    // Filtreleme mantığı (değişiklik yok)
    if (level && ["info", "warn", "error", "debug"].includes(level))
      filter.level = level;
    if (action) filter.action = { $regex: action, $options: "i" };
    if (userId) filter.userId = userId;
    if (startDate || endDate) {
      filter.timestamp = {};
      if (startDate) filter.timestamp.$gte = new Date(startDate);
      if (endDate) filter.timestamp.$lte = new Date(endDate);
    }
    if (search) {
      filter.$or = [
        { message: { $regex: search, $options: "i" } },
        { username: { $regex: search, $options: "i" } },
        { action: { $regex: search, $options: "i" } },
        { "metadata.username": { $regex: search, $options: "i" } },
        { "metadata.action": { $regex: search, $options: "i" } },
      ];
    }

    const skip = (parseInt(page) - 1) * parseInt(limit);
    const limitNum = parseInt(limit);

    const logs = await Log.find(filter)
      .populate("userId", "username email userName")
      .sort({ timestamp: -1 })
      .skip(skip)
      .limit(limitNum)
      .lean();

    const totalLogs = await Log.countDocuments(filter);
    const totalPages = Math.ceil(totalLogs / limitNum);

    // YENİ: Logları formatlama mantığı
    const formattedLogs = logs.map((log) => {
      // Hem kök dizindeki hem de metadata içindeki veriyi kontrol et
      const meta = log.metadata || {};
      return {
        id: log._id,
        timestamp: log.timestamp,
        level: log.level,
        message: log.message,
        user: log.userId
          ? {
              id: log.userId._id,
              username:
                log.userId.username || log.userId.email || log.userId.userName,
            }
          : null,
        username:
          log.username ||
          meta.username ||
          (log.userId
            ? log.userId.username || log.userId.email || log.userId.userName
            : null),
        ipAddress: log.ipAddress || meta.ipAddress,
        userAgent: log.userAgent || meta.userAgent,
        action: log.action || meta.action,
        resourceId: log.resourceId || meta.resourceId,
        resourceType: log.resourceType || meta.resourceType,
        additionalData: log.additionalData || meta.additionalData,
      };
    });

    logInfo("Loglar görüntülendi", req, {
      action: "VIEW_LOGS",
      filters: { level, action, userId, startDate, endDate, search },
      page,
      limit,
      totalResults: totalLogs,
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
      stack: error.stack,
    });
    res.status(500).json({
      success: false,
      message: "Loglar alınırken bir hata oluştu.",
      error: process.env.NODE_ENV === "development" ? error.message : undefined,
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

    // Action bazında istatistikler - DÜZELTİLDİ
    const actionStats = await Log.aggregate([
      { $match: { ...dateFilter, action: { $exists: true, $ne: null } } },
      {
        $group: {
          _id: "$action", 
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
      .populate("userId", "username email userName") 
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
        user: log.userId
          ? {
              id: log.userId._id || log.userId,
              username:
                log.userId.username || log.userId.email || log.userId.userName,
            }
          : null,
        username:
          log.username ||
          (log.userId && typeof log.userId === "object"
            ? log.userId.username || log.userId.email || log.userId.userName
            : null),
        ipAddress: log.ipAddress,
        userAgent: log.userAgent,
        action: log.action,
        resourceId: log.resourceId,
        resourceType: log.resourceType,
        additionalData: log.additionalData,
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
