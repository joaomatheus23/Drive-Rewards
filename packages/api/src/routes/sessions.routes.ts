import type { FastifyInstance } from "fastify";
import { verifyJWT } from "../middleware/verify-jwt.js";
import { requireDriver } from "../middleware/require-role.js";

/** Driving session tracking — GPS points, km, points */
export async function sessionRoutes(app: FastifyInstance): Promise<void> {
  app.addHook("preHandler", verifyJWT);
  app.addHook("preHandler", requireDriver);

  app.post("/start", async (_request, reply) => {
    reply.status(501).send({
      success: false,
      error: { code: "NOT_IMPLEMENTED", message: "Start session pending" },
    });
  });

  app.post("/:id/gps", async (_request, reply) => {
    reply.status(501).send({
      success: false,
      error: { code: "NOT_IMPLEMENTED", message: "Append GPS points pending" },
    });
  });

  app.post("/:id/end", async (_request, reply) => {
    reply.status(501).send({
      success: false,
      error: { code: "NOT_IMPLEMENTED", message: "End session pending" },
    });
  });
}
