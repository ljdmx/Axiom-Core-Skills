/**
 * Unified Logging System
 * 
 * Provides structured and leveled logging management.
 * Supports file output, log rotation, and performance tracking.
 * 
 * Integration: Winston + Custom Formatting
 */

import * as winston from 'winston';
import * as path from 'path';
import * as fs from 'fs';

// Log Levels
export enum LogLevel {
    ERROR = 'error',
    WARN = 'warn',
    INFO = 'info',
    HTTP = 'http',
    DEBUG = 'debug'
}

// Log Directory
const LOG_DIR = path.join(process.cwd(), 'logs');

// Ensure log directory exists
if (!fs.existsSync(LOG_DIR)) {
    fs.mkdirSync(LOG_DIR, { recursive: true });
}

// Custom Formatting
const customFormat = winston.format.printf(({ timestamp, level, message, context, trace, ...meta }) => {
    let log = `${timestamp} [${level.toUpperCase()}]`;

    if (context) {
        log += ` [${context}]`;
    }

    log += ` ${message}`;

    if (Object.keys(meta).length) {
        log += ` ${JSON.stringify(meta)}`;
    }

    if (trace) {
        log += `\n${trace}`;
    }

    return log;
});

// Winston Logger Configuration
const logger = winston.createLogger({
    level: process.env.LOG_LEVEL || 'info',
    format: winston.format.combine(
        winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
        winston.format.errors({ stack: true }),
        winston.format.splat(),
        customFormat
    ),
    transports: [
        // Console output (with colors for non-production)
        new winston.transports.Console({
            format: winston.format.combine(
                winston.format.colorize(),
                customFormat
            )
        }),

        // Combined logs
        new winston.transports.File({
            filename: path.join(LOG_DIR, 'combined.log'),
            maxsize: 5242880, // 5MB
            maxFiles: 5,
        }),

        // Error logs
        new winston.transports.File({
            filename: path.join(LOG_DIR, 'error.log'),
            level: 'error',
            maxsize: 5242880,
            maxFiles: 5,
        }),

        // HTTP logs
        new winston.transports.File({
            filename: path.join(LOG_DIR, 'http.log'),
            level: 'http',
            maxsize: 5242880,
            maxFiles: 3,
        })
    ],
});

// Production JSON formatting
if (process.env.NODE_ENV === 'production') {
    logger.format = winston.format.combine(
        winston.format.timestamp(),
        winston.format.errors({ stack: true }),
        winston.format.json()
    );
}

/**
 * Logger Service Class
 */
export class LoggerService {
    private context?: string;

    constructor(context?: string) {
        this.context = context;
    }

    log(message: string, context?: string) {
        logger.info(message, { context: context || this.context });
    }

    error(message: string, trace?: string, context?: string) {
        logger.error(message, { context: context || this.context, trace });
    }

    warn(message: string, context?: string) {
        logger.warn(message, { context: context || this.context });
    }

    debug(message: string, context?: string) {
        logger.debug(message, { context: context || this.context });
    }

    http(message: string, meta?: any) {
        logger.http(message, { context: this.context, ...meta });
    }

    /**
     * Performance Monitoring
     * Measures the time taken by an asynchronous operation.
     */
    async measure<T>(operation: string, fn: () => Promise<T>): Promise<T> {
        const start = Date.now();
        try {
            const result = await fn();
            const duration = Date.now() - start;
            this.log(`${operation} completed in ${duration}ms`);
            return result;
        } catch (error) {
            const duration = Date.now() - start;
            this.error(
                `${operation} failed after ${duration}ms`,
                error instanceof Error ? error.stack : String(error)
            );
            throw error;
        }
    }

    /**
     * Log Database Query
     */
    logQuery(query: string, duration: number, params?: any) {
        this.debug(`Query: ${query} | Duration: ${duration}ms`, 'Database');
        if (params) {
            this.debug(`Params: ${JSON.stringify(params)}`, 'Database');
        }
    }

    /**
     * Log HTTP/API Request
     */
    logRequest(method: string, url: string, statusCode: number, duration: number) {
        const message = `${method} ${url} ${statusCode} ${duration}ms`;
        if (statusCode >= 500) {
            this.error(message, undefined, 'HTTP');
        } else if (statusCode >= 400) {
            this.warn(message, 'HTTP');
        } else {
            this.http(message);
        }
    }
}

export default new LoggerService('App');
