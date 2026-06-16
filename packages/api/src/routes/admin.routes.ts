import type { FastifyInstance } from "fastify";
import { verifyJWT } from "../middleware/verify-jwt.js";
import { requireAdmin } from "../middleware/require-role.js";

/** Internal admin routes — user/partner management, analytics */
export async function adminRoutes(app: FastifyInstance): Promise<void> {
  app.addHook("preHandler", verifyJWT);
  app.addHook("preHandler", requireAdmin);

  app.get("/stats", async (_request, reply) => {
    reply.status(501).send({
      success: false,
      error: { code: "NOT_IMPLEMENTED", message: "Admin stats pending" },
    });
  });

  app.get("/users", async (_request, reply) => {
    reply.status(501).send({
      success: false,
      error: { code: "NOT_IMPLEMENTED", message: "List users pending" },
    });
  });
}
