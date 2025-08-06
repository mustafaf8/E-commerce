const winston = require("winston");
const WinstonMongoDB = require("winston-mongodb");
const Log = require("../models/Log");

// Winston MongoDB transport için özel format
const mongoFormat = winston.format.combine(
  winston.format.timestamp(),
  winston.format.errors({ stack: true }),
  winston.format.json()
);

// Console format
const consoleFormat = winston.format.combine(
  winston.format.colorize(),
  winston.format.timestamp({ format: "YYYY-MM-DD HH:mm:ss" }),
  winston.format.printf(({ timestamp, level, message, meta }) => {
    let logMessage = `${timestamp} [${level.toUpperCase()}]: ${message}`;
    if (meta) {
      logMessage += ` | Meta: ${JSON.stringify(meta)}`;
    }
    return logMessage;
  })
);

// Logger oluştur
const logger = winston.createLogger({
  level: process.env.LOG_LEVEL || "info",
  format: mongoFormat,
  transports: [
    // Console transport (geliştirme ortamı için)
    new winston.transports.Console({
      format: consoleFormat,
      level: "debug",
    }),
    
    // MongoDB transport
    new WinstonMongoDB.MongoDB({
      level: "info",
      db: process.env.MONGO_URI,
      collection: "logs",
      options: {
        useUnifiedTopology: true,
      },
      format: winston.format.combine(
        winston.format.timestamp(),
        winston.format.errors({ stack: true }),
        winston.format.json()
      ),
    }),
  ],
  exceptionHandlers: [
    new winston.transports.Console({
      format: consoleFormat,
    }),
    new WinstonMongoDB.MongoDB({
      db: process.env.MONGO_URI,
      collection: "logs",
      options: {
        useUnifiedTopology: true,
      },
    }),
  ],
  rejectionHandlers: [
    new winston.transports.Console({
      format: consoleFormat,
    }),
    new WinstonMongoDB.MongoDB({
      db: process.env.MONGO_URI,
      collection: "logs",
      options: {
        useUnifiedTopology: true,
      },
    }),
  ],
});

// Özel log fonksiyonu - kullanıcı bilgileri ile
const logWithUser = (level, message, req = null, additionalMeta = {}) => {
  const meta = {
    ...additionalMeta,
  };

  // Request bilgilerini ekle
  if (req) {
    meta.ipAddress = req.ip || req.connection.remoteAddress;
    meta.userAgent = req.get("User-Agent");
    
    // Kullanıcı bilgilerini ekle
    if (req.user) {
      meta.userId = req.user._id;
      meta.username = req.user.username || req.user.email;
      console.log("Logger: Kullanıcı bilgileri eklendi:", {
        userId: req.user._id,
        username: req.user.username || req.user.email
      });
    } else {
      console.log("Logger: req.user bulunamadı");
    }
  } else {
    console.log("Logger: req objesi null");
  }

  console.log("Logger: Meta bilgileri:", meta);
  logger.log(level, message, meta);
};

// Basit log fonksiyonu
const log = (level, message, meta = {}) => {
  logger.log(level, message, meta);
};

// Kullanım kolaylığı için yardımcı fonksiyonlar
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
  log,
  logInfo,
  logError,
  logWarn,
  logDebug,
  logWithUser,
}; 