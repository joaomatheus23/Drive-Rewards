import type { FastifyInstance } from "fastify";
import { verifyJWT } from "../middleware/verify-jwt.js";
import { requirePartnerOwner } from "../middleware/require-role.js";

/** Coupon management for partners */
export async function couponRoutes(app: FastifyInstance): Promise<void> {
  app.get("/partner/:partnerId", async (_request, reply) => {
    reply.status(501).send({
      success: false,
      error: { code: "NOT_IMPLEMENTED", message: "List coupons pending" },
    });
  });

  app.post("/", { preHandler: [verifyJWT, requirePartnerOwner] }, async (_request, reply) => {
    reply.status(501).send({
      success: false,
      error: { code: "NOT_IMPLEMENTED", message: "Create coupon pending" },
    });
  });
}
