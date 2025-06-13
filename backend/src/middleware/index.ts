import { Request, Response, NextFunction } from "express";
import { errorResponse } from "../utils";
import { ApiError } from "../types";

/**
 * Error handling middleware
 */
export function errorHandler(
  error: Error | ApiError,
  req: Request,
  res: Response,
  next: NextFunction,
) {
  console.error("Error:", error);

  if ("statusCode" in error) {
    return res
      .status(error.statusCode)
      .json(errorResponse(error.message, error.code));
  }

  // Default error
  res
    .status(500)
    .json(errorResponse("Internal server error", "INTERNAL_ERROR"));
}

/**
 * 404 Not Found handler
 */
export function notFoundHandler(req: Request, res: Response) {
  res
    .status(404)
    .json(
      errorResponse(`Route ${req.method} ${req.path} not found`, "NOT_FOUND"),
    );
}

/**
 * Async route handler wrapper
 */
export function asyncHandler(
  fn: (req: Request, res: Response, next: NextFunction) => Promise<any>,
) {
  return (req: Request, res: Response, next: NextFunction) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
}

/**
 * Validation middleware
 */
export function validate(schema: any) {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      const { error, value } = schema.validate(req.body, {
        abortEarly: false,
        stripUnknown: true,
      });

      if (error) {
        const errors = error.details.map((detail: any) => detail.message);
        return res
          .status(400)
          .json(errorResponse(errors.join(", "), "VALIDATION_ERROR"));
      }

      req.body = value;
      next();
    } catch (err) {
      next(err);
    }
  };
}

/**
 * Request logging middleware
 */
export function requestLogger(req: Request, res: Response, next: NextFunction) {
  const start = Date.now();
  const { method, url, ip } = req;

  res.on("finish", () => {
    const duration = Date.now() - start;
    const { statusCode } = res;

    console.log(
      `${new Date().toISOString()} - ${method} ${url} - ${statusCode} - ${duration}ms - ${ip}`,
    );
  });

  next();
}

/**
 * Rate limiting (simple in-memory implementation)
 */
const rateLimitMap = new Map<string, { count: number; lastReset: number }>();

export function rateLimit(
  maxRequests: number = 100,
  windowMs: number = 15 * 60 * 1000,
) {
  return (req: Request, res: Response, next: NextFunction) => {
    const key = req.ip;
    const now = Date.now();

    if (!rateLimitMap.has(key)) {
      rateLimitMap.set(key, { count: 0, lastReset: now });
    }

    const record = rateLimitMap.get(key)!;

    // Reset count if window has passed
    if (now - record.lastReset > windowMs) {
      record.count = 0;
      record.lastReset = now;
    }

    // Check if limit exceeded
    if (record.count >= maxRequests) {
      return res
        .status(429)
        .json(
          errorResponse(
            "Too many requests, please try again later",
            "RATE_LIMIT_EXCEEDED",
          ),
        );
    }

    record.count++;
    next();
  };
}

/**
 * CORS headers middleware (additional to the cors package)
 */
export function corsHeaders(req: Request, res: Response, next: NextFunction) {
  res.header("Access-Control-Allow-Credentials", "true");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, Authorization",
  );
  res.header(
    "Access-Control-Allow-Methods",
    "GET, POST, PUT, DELETE, OPTIONS, PATCH",
  );

  // Handle preflight
  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  next();
}

/**
 * Request sanitization middleware
 */
export function sanitizeRequest(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  // Remove potential XSS and injection attempts
  const sanitize = (obj: any): any => {
    if (typeof obj === "string") {
      return obj
        .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, "")
        .replace(/javascript:/gi, "")
        .replace(/on\w+\s*=/gi, "");
    }
    if (Array.isArray(obj)) {
      return obj.map(sanitize);
    }
    if (obj && typeof obj === "object") {
      const sanitized: any = {};
      for (const key in obj) {
        if (obj.hasOwnProperty(key)) {
          sanitized[key] = sanitize(obj[key]);
        }
      }
      return sanitized;
    }
    return obj;
  };

  if (req.body) {
    req.body = sanitize(req.body);
  }
  if (req.query) {
    req.query = sanitize(req.query);
  }
  if (req.params) {
    req.params = sanitize(req.params);
  }

  next();
}

/**
 * Health check middleware
 */
export function healthCheck(req: Request, res: Response) {
  res.status(200).json({
    success: true,
    message: "Server is healthy",
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    memory: process.memoryUsage(),
  });
}

/**
 * API version middleware
 */
export function apiVersion(version: string) {
  return (req: Request, res: Response, next: NextFunction) => {
    res.header("API-Version", version);
    next();
  };
}

/**
 * Response time middleware
 */
export function responseTime(req: Request, res: Response, next: NextFunction) {
  const start = Date.now();

  res.on("finish", () => {
    const duration = Date.now() - start;
    res.header("X-Response-Time", `${duration}ms`);
  });

  next();
}

/**
 * Content type validation middleware
 */
export function validateContentType(
  allowedTypes: string[] = ["application/json"],
) {
  return (req: Request, res: Response, next: NextFunction) => {
    if (req.method === "GET" || req.method === "DELETE") {
      return next();
    }

    const contentType = req.get("Content-Type");

    if (
      !contentType ||
      !allowedTypes.some((type) => contentType.includes(type))
    ) {
      return res
        .status(415)
        .json(
          errorResponse(
            `Unsupported Media Type. Allowed types: ${allowedTypes.join(", ")}`,
            "UNSUPPORTED_MEDIA_TYPE",
          ),
        );
    }

    next();
  };
}

/**
 * Request size limiter
 */
export function limitRequestSize(maxSize: string = "10mb") {
  return (req: Request, res: Response, next: NextFunction) => {
    const contentLength = req.get("Content-Length");

    if (contentLength) {
      const sizeInBytes = parseInt(contentLength);
      const maxSizeInBytes = parseSize(maxSize);

      if (sizeInBytes > maxSizeInBytes) {
        return res
          .status(413)
          .json(
            errorResponse(
              `Request entity too large. Maximum size is ${maxSize}`,
              "REQUEST_TOO_LARGE",
            ),
          );
      }
    }

    next();
  };
}

// Helper function to parse size strings like "10mb", "1gb", etc.
function parseSize(size: string): number {
  const units: { [key: string]: number } = {
    b: 1,
    kb: 1024,
    mb: 1024 * 1024,
    gb: 1024 * 1024 * 1024,
  };

  const match = size.toLowerCase().match(/^(\d+(?:\.\d+)?)\s*([a-z]+)$/);
  if (!match) return 0;

  const [, num, unit] = match;
  return parseFloat(num) * (units[unit] || 0);
}

/**
 * Security headers middleware
 */
export function securityHeaders(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  // Remove powered by header
  res.removeHeader("X-Powered-By");

  // Set security headers
  res.header("X-Content-Type-Options", "nosniff");
  res.header("X-Frame-Options", "DENY");
  res.header("X-XSS-Protection", "1; mode=block");
  res.header("Referrer-Policy", "strict-origin-when-cross-origin");
  res.header("Permissions-Policy", "geolocation=(), microphone=(), camera=()");

  next();
}

/**
 * Database connection check middleware
 */
export function checkDbConnection(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    // This is a simple check - in a real app you might want to ping the database
    const db = require("../database/config").default;

    if (!db || !db.open) {
      return res
        .status(503)
        .json(
          errorResponse(
            "Database connection unavailable",
            "DB_CONNECTION_ERROR",
          ),
        );
    }

    next();
  } catch (error) {
    res
      .status(503)
      .json(errorResponse("Database connection error", "DB_CONNECTION_ERROR"));
  }
}
