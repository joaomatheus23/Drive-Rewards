import type { FastifyInstance } from "fastify";
import { verifyJWT } from "../middleware/verify-jwt.js";
import { requireDriver, requirePartner } from "../middleware/require-role.js";

/** Redemption flow — driver redeems, partner staff scans QR */
export async function redemptionRoutes(app: FastifyInstance): Promise<void> {
  app.post("/", { preHandler: [verifyJWT, requireDriver] }, async (_request, reply) => {
    reply.status(501).send({
      success: false,
      error: { code: "NOT_IMPLEMENTED", message: "Redeem coupon pending" },
    });
  });

  app.post("/scan", { preHandler: [verifyJWT, requirePartner] }, async (_request, reply) => {
    reply.status(501).send({
      success: false,
      error: { code: "NOT_IMPLEMENTED", message: "QR scan pending" },
    });
  });
}
