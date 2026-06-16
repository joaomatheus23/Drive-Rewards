import { z } from "zod";
import type { FastifyInstance } from "fastify";
import { AppError } from "../middleware/error-handler.js";
import { verifyJWT } from "../middleware/verify-jwt.js";
import {
  authenticateUser,
  buildJwtPayload,
  clearRefreshToken,
  generateRefreshToken,
  persistRefreshToken,
  registerDriver,
  rotateRefreshToken,
  toSafeUser,
} from "../services/auth.service.js";

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});

const registerSchema = z.object({
  name: z.string().min(2).max(120),
  email: z.string().email(),
  password: z.string().min(6).max(128),
});

const refreshSchema = z.object({
  refreshToken: z.string().min(1),
});

async function issueTokens(
  app: FastifyInstance,
  user: Awaited<ReturnType<typeof authenticateUser>>,
) {
  const refreshToken = generateRefreshToken();
  await persistRefreshToken(user, refreshToken);

  const accessToken = app.jwt.sign(buildJwtPayload(user));

  return {
    accessToken,
    refreshToken,
    user: toSafeUser(user),
  };
}

/** Auth routes — login, register, refresh, logout */
export async function authRoutes(app: FastifyInstance): Promise<void> {
  app.post("/login", async (request, reply) => {
    const body = loginSchema.parse(request.body);
    const user = await authenticateUser(body.email, body.password);
    const tokens = await issueTokens(app, user);
    reply.send({ success: true, data: tokens });
  });

  app.post("/register", async (request, reply) => {
    const body = registerSchema.parse(request.body);
    const user = await registerDriver(body);
    const tokens = await issueTokens(app, user);
    reply.status(201).send({ success: true, data: tokens });
  });

  app.post("/refresh", async (request, reply) => {
    const body = refreshSchema.parse(request.body);
    const user = await rotateRefreshToken(body.refreshToken);
    const tokens = await issueTokens(app, user);
    reply.send({ success: true, data: tokens });
  });

  app.post("/logout", { preHandler: verifyJWT }, async (request, reply) => {
    await clearRefreshToken(request.user.sub);
    reply.send({ success: true, data: { message: "Logged out" } });
  });
}
