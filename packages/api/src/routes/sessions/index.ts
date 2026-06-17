/**
 * Session routes index
 * Role: api
 * Entry: /api/v1/sessions
 * Exit: registers protected driver session endpoints
 */
import type { FastifyInstance } from "fastify";
import { verifyJWT } from "../../middleware/verify-jwt.js";
import { requireDriver } from "../../middleware/require-role.js";
import { registerSessionHandlers } from "./handlers.js";

export async function sessionRoutes(app: FastifyInstance): Promise<void> {
  app.addHook("preHandler", verifyJWT);
  app.addHook("preHandler", requireDriver);
  await registerSessionHandlers(app);
}
