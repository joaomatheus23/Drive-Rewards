import type { FastifyInstance } from "fastify";
import { z } from "zod";
import { verifyJWT } from "../middleware/verify-jwt.js";
import { requireDriver } from "../middleware/require-role.js";
import { requirePartnerOwner } from "../middleware/require-role.js";
import {
  getDriverCouponById,
  listNearbyCoupons,
} from "../services/coupon.service.js";

const nearbyQuerySchema = z.object({
  lat: z.coerce.number().optional(),
  lng: z.coerce.number().optional(),
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(50).default(10),
  filter: z.string().optional(),
  search: z.string().optional(),
});

const couponIdSchema = z.object({
  id: z.string().min(1),
});

/** Coupon management and driver discovery */
export async function couponRoutes(app: FastifyInstance): Promise<void> {
  app.get(
    "/nearby",
    { preHandler: [verifyJWT, requireDriver] },
    async (request, reply) => {
      const query = nearbyQuerySchema.parse(request.query);
      const data = await listNearbyCoupons(request.user.sub, query);
      reply.send({ success: true, data });
    },
  );

  app.get(
    "/:id",
    { preHandler: [verifyJWT, requireDriver] },
    async (request, reply) => {
      const params = couponIdSchema.parse(request.params);
      const query = z
        .object({ lat: z.coerce.number().optional(), lng: z.coerce.number().optional() })
        .parse(request.query);
      const data = await getDriverCouponById(
        request.user.sub,
        params.id,
        query.lat,
        query.lng,
      );
      reply.send({ success: true, data });
    },
  );

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
