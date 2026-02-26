/**
 * Logger utility for the Streaming API
 * Provides structured logging with levels and timestamps
 */

import { config } from "../config/config.js";

const LogLevel = {
  ERROR: 0,
  WARN: 1,
  INFO: 2,
  DEBUG: 3,
};

const colors = {
  reset: "\x1b[0m",
  red: "\x1b[31m",
  yellow: "\x1b[33m",
  blue: "\x1b[34m",
  cyan: "\x1b[36m",
  gray: "\x1b[90m",
};

class Logger {
  constructor(options = {}) {
    this.level = LogLevel[options.level?.toUpperCase()] || LogLevel.INFO;
    this.enableColors = options.enableColors !== false;
    this.enableTimestamp = options.enableTimestamp !== false;
  }

  _log(level, levelName, color, message, meta = {}) {
    if (level > this.level) return;

    const timestamp = this.enableTimestamp ? new Date().toISOString() : null;

    const colorCode = this.enableColors ? color : "";
    const resetCode = this.enableColors ? colors.reset : "";

    const parts = [];
    if (timestamp) parts.push(`${colors.gray}[${timestamp}]${resetCode}`);
    parts.push(`${colorCode}[${levelName}]${resetCode}`);
    parts.push(message);

    const logMessage = parts.join(" ");

    if (Object.keys(meta).length > 0) {
      console.log(logMessage, meta);
    } else {
      console.log(logMessage);
    }
  }

  error(message, meta) {
    this._log(LogLevel.ERROR, "ERROR", colors.red, message, meta);
  }

  warn(message, meta) {
    this._log(LogLevel.WARN, "WARN", colors.yellow, message, meta);
  }

  info(message, meta) {
    this._log(LogLevel.INFO, "INFO", colors.blue, message, meta);
  }

  debug(message, meta) {
    this._log(LogLevel.DEBUG, "DEBUG", colors.cyan, message, meta);
  }

  /**
   * Log socket events for debugging
   */
  logSocketEvent(eventName, socketId, data = {}) {
    this.debug(`Socket Event: ${eventName}`, {
      socketId: socketId?.substring(0, 8),
      ...data,
    });
  }
}

// Create singleton instance
export const logger = new Logger(config.logging);
export default logger;
