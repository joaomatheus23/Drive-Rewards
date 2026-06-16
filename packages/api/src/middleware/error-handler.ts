import type { FastifyError, FastifyReply, FastifyRequest } from "fastify";
import { ZodError } from "zod";

/** Application-level error with HTTP status code */
export class AppError extends Error {
  constructor(
    public statusCode: number,
    public code: string,
    message: string,
  ) {
    super(message);
    this.name = "AppError";
  }
}

/** Global error handler — normalizes all errors into ApiResponse envelope */
export function errorHandler(
  error: FastifyError,
  _request: FastifyRequest,
  reply: FastifyReply,
): void {
  if (error instanceof AppError) {
    reply.status(error.statusCode).send({
      success: false,
      error: { code: error.code, message: error.message },
    });
    return;
  }

  // Zod validation
  if (error instanceof ZodError) {
    reply.status(400).send({
      success: false,
      error: {
        code: "VALIDATION_ERROR",
        message: error.errors[0]?.message ?? "Invalid request body",
      },
    });
    return;
  }

  // Mongoose validation error
  if (error.name === "ValidationError") {
    reply.status(400).send({
      success: false,
      error: { code: "VALIDATION_ERROR", message: error.message },
    });
    return;
  }

  // Mongoose duplicate key
  const mongoError = error as unknown as { code?: number };
  if (mongoError.code === 11000) {
    reply.status(409).send({
      success: false,
      error: { code: "DUPLICATE_KEY", message: "Resource already exists" },
    });
    return;
  }

  // JWT errors
  if (error.statusCode === 401) {
    reply.status(401).send({
      success: false,
      error: { code: "UNAUTHORIZED", message: error.message },
    });
    return;
  }

  const statusCode = error.statusCode ?? 500;
  const message =
    process.env.NODE_ENV === "production"
      ? "Internal server error"
      : error.message;

  reply.status(statusCode).send({
    success: false,
    error: { code: "INTERNAL_ERROR", message },
  });
}
