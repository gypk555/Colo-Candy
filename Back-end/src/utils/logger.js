// Logger Utility for consistent logging across the application

const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  dim: '\x1b[2m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
  cyan: '\x1b[36m'
};

const getTimestamp = () => {
  const now = new Date();
  return now.toISOString();
};

export const logger = {
  // Info logs
  info: (message, data = null) => {
    const log = `${colors.cyan}[INFO]${colors.reset} ${getTimestamp()} - ${message}`;
    console.log(log, data || '');
  },

  // Success logs
  success: (message, data = null) => {
    const log = `${colors.green}[SUCCESS]${colors.reset} ${getTimestamp()} - ${message}`;
    console.log(log, data || '');
  },

  // Warning logs
  warn: (message, data = null) => {
    const log = `${colors.yellow}[WARN]${colors.reset} ${getTimestamp()} - ${message}`;
    console.warn(log, data || '');
  },

  // Error logs
  error: (message, error = null) => {
    const log = `${colors.red}[ERROR]${colors.reset} ${getTimestamp()} - ${message}`;
    console.error(log, error || '');
  },

  // Database logs
  db: (message, data = null) => {
    const log = `${colors.magenta}[DB]${colors.reset} ${getTimestamp()} - ${message}`;
    console.log(log, data || '');
  },

  // API logs
  api: (method, path, statusCode, duration) => {
    const statusColor = statusCode >= 400 ? colors.red : colors.green;
    const log = `${colors.blue}[API]${colors.reset} ${statusColor}${method} ${path} - ${statusCode}${colors.reset} (${duration}ms)`;
    console.log(log);
  },

  // Auth logs
  auth: (message, data = null) => {
    const log = `${colors.cyan}[AUTH]${colors.reset} ${getTimestamp()} - ${message}`;
    console.log(log, data || '');
  },

  // Performance logs
  perf: (operation, duration) => {
    const log = `${colors.bright}[PERF]${colors.reset} ${operation} completed in ${duration}ms`;
    console.log(log);
  }
};

export default logger;
