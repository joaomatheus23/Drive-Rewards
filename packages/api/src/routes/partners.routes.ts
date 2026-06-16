import type { FastifyInstance } from "fastify";
import { verifyJWT } from "../middleware/verify-jwt.js";
import { requirePartner, requirePartnerOwner } from "../middleware/require-role.js";

/** Partner CRUD and geofence management */
export async function partnerRoutes(app: FastifyInstance): Promise<void> {
  app.get("/", async (_request, reply) => {
    reply.status(501).send({
      success: false,
      error: { code: "NOT_IMPLEMENTED", message: "List partners pending" },
    });
  });

  app.get("/:id", async (_request, reply) => {
    reply.status(501).send({
      success: false,
      error: { code: "NOT_IMPLEMENTED", message: "Get partner pending" },
    });
  });

  app.post("/", { preHandler: [verifyJWT, requirePartnerOwner] }, async (_request, reply) => {
    reply.status(501).send({
      success: false,
      error: { code: "NOT_IMPLEMENTED", message: "Create partner pending" },
    });
  });

  app.patch("/:id", { preHandler: [verifyJWT, requirePartnerOwner] }, async (_request, reply) => {
    reply.status(501).send({
      success: false,
      error: { code: "NOT_IMPLEMENTED", message: "Update partner pending" },
    });
  });

  app.get("/:id/dashboard", { preHandler: [verifyJWT, requirePartner] }, async (_request, reply) => {
    reply.status(501).send({
      success: false,
      error: { code: "NOT_IMPLEMENTED", message: "Partner dashboard pending" },
    });
  });
}
