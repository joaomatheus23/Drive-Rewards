import fp from "fastify-plugin";
import cors from "@fastify/cors";
import helmet from "@fastify/helmet";
import jwt from "@fastify/jwt";
import rateLimit from "@fastify/rate-limit";
import type { FastifyInstance } from "fastify";
import type { JwtPayload } from "@driven-rewards/shared";
import { getCorsOrigins, type Env } from "../config/env.js";
import { AUTH } from "@driven-rewards/utils";

declare module "@fastify/jwt" {
  interface FastifyJWT {
    payload: JwtPayload;
    user: JwtPayload;
  }
}

/** Register all global Fastify plugins (cors, helmet, jwt, rate-limit) */
export default fp(async function registerPlugins(app: FastifyInstance, env: Env) {
  await app.register(helmet, {
    contentSecurityPolicy: env.NODE_ENV === "production",
  });

  await app.register(cors, {
    origin: getCorsOrigins(env),
    credentials: true,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
  });

  await app.register(jwt, {
    secret: env.JWT_SECRET,
    sign: { expiresIn: AUTH.ACCESS_TOKEN_EXPIRY },
  });

  await app.register(rateLimit, {
    max: env.RATE_LIMIT_MAX,
    timeWindow: env.RATE_LIMIT_WINDOW_MS,
    errorResponseBuilder: (_req, context) => ({
      success: false,
      error: {
        code: "RATE_LIMIT_EXCEEDED",
        message: `Too many requests. Retry after ${context.after}.`,
      },
    }),
  });
});
