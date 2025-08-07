const winston = require("winston");
const WinstonMongoDB = require("winston-mongodb");

// Console için formatlama (değişiklik yok)
const consoleFormat = winston.format.combine(
  winston.format.colorize(),
  winston.format.timestamp({ format: "YYYY-MM-DD HH:mm:ss" }),
  winston.format.printf(({ timestamp, level, message, ...meta }) => {
    let logMessage = `${timestamp} [${level}]: ${message}`;
    if (Object.keys(meta).length > 0) {
      logMessage += ` | ${JSON.stringify(meta)}`;
    }
    return logMessage;
  })
);

// Logger oluştur
const logger = winston.createLogger({
  level: process.env.LOG_LEVEL || "warn",
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.errors({ stack: true }),
    winston.format.json() // Tüm logları JSON formatına çeviriyoruz
  ),
  transports: [
    // new winston.transports.Console({
    //   format: consoleFormat,
    //   level: "debug",
    // }),
    new WinstonMongoDB.MongoDB({
      level: "warn",
      db: process.env.MONGO_URI,
      collection: "logs",
      // YENİ: storeHostMeta seçeneği, meta verilerini düzgünce kaydetmek için
      storeHostMeta: true,
    }),
  ],
});

// Log fonksiyonu - GÜNCELLENDİ
const logWithUser = (level, message, req = null, additionalMeta = {}) => {
  const meta = { ...additionalMeta };

  if (req) {
    meta.ipAddress =
      req.ip ||
      req.connection?.remoteAddress ||
      req.socket?.remoteAddress ||
      (req.headers ? req.headers["x-forwarded-for"] : null);

    meta.userAgent = req.get
      ? req.get("User-Agent")
      : req.headers?.["user-agent"];

    if (req.user) {
      meta.userId = req.user._id || req.user.id;
      meta.username = req.user.username || req.user.email || req.user.userName;
    }
  }

  // Winston'a logu meta objesiyle birlikte gönderiyoruz
  logger.log(level, message, meta);
};

// Diğer log fonksiyonları (değişiklik yok)
const logInfo = (message, req = null, additionalMeta = {}) => {
  logWithUser("info", message, req, additionalMeta);
};

const logError = (message, req = null, additionalMeta = {}) => {
  logWithUser("error", message, req, additionalMeta);
};

const logWarn = (message, req = null, additionalMeta = {}) => {
  logWithUser("warn", message, req, additionalMeta);
};

const logDebug = (message, req = null, additionalMeta = {}) => {
  logWithUser("debug", message, req, additionalMeta);
};

module.exports = {
  logger,
  logInfo,
  logError,
  logWarn,
  logDebug,
  logWithUser,
};
