import type { FastifyInstance } from "fastify";
import { verifyJWT } from "../middleware/verify-jwt.js";
import { requireDriver } from "../middleware/require-role.js";

/** Smart Routine — detected patterns and manual management */
export async function routineRoutes(app: FastifyInstance): Promise<void> {
  app.addHook("preHandler", verifyJWT);
  app.addHook("preHandler", requireDriver);

  app.get("/", async (_request, reply) => {
    reply.status(501).send({
      success: false,
      error: { code: "NOT_IMPLEMENTED", message: "List routines pending" },
    });
  });

  app.patch("/:id", async (_request, reply) => {
    reply.status(501).send({
      success: false,
      error: { code: "NOT_IMPLEMENTED", message: "Update routine pending" },
    });
  });
}
