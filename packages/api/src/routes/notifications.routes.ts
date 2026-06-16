import type { FastifyInstance } from "fastify";
import { verifyJWT } from "../middleware/verify-jwt.js";
import { requireDriver } from "../middleware/require-role.js";

/** Push notification log and open tracking */
export async function notificationRoutes(app: FastifyInstance): Promise<void> {
  app.addHook("preHandler", verifyJWT);
  app.addHook("preHandler", requireDriver);

  app.get("/", async (_request, reply) => {
    reply.status(501).send({
      success: false,
      error: { code: "NOT_IMPLEMENTED", message: "List notifications pending" },
    });
  });

  app.patch("/:id/opened", async (_request, reply) => {
    reply.status(501).send({
      success: false,
      error: { code: "NOT_IMPLEMENTED", message: "Mark opened pending" },
    });
  });
}
