import type { FastifyInstance } from "fastify";
import { z } from "zod";
import { verifyJWT } from "../middleware/verify-jwt.js";
import { requireDriver, requirePartner } from "../middleware/require-role.js";
import {
  confirmRedemptionByToken,
  generateCouponQr,
  getRedemptionStatus,
  invalidateRedemption,
} from "../services/redemption.service.js";

const generateQrSchema = z.object({
  couponId: z.string().min(1),
  lat: z.number().optional(),
  lng: z.number().optional(),
});

const redemptionIdSchema = z.object({
  id: z.string().min(1),
});

const scanSchema = z.object({
  qrToken: z.string().min(1),
});

/** Redemption flow — driver redeems, partner staff scans QR */
export async function redemptionRoutes(app: FastifyInstance): Promise<void> {
  app.post(
    "/generate-qr",
    { preHandler: [verifyJWT, requireDriver] },
    async (request, reply) => {
      const body = generateQrSchema.parse(request.body);
      const data = await generateCouponQr(
        request.user.sub,
        body.couponId,
        body.lat,
        body.lng,
      );
      reply.status(201).send({ success: true, data });
    },
  );

  app.get(
    "/:id",
    { preHandler: [verifyJWT, requireDriver] },
    async (request, reply) => {
      const params = redemptionIdSchema.parse(request.params);
      const data = await getRedemptionStatus(request.user.sub, params.id);
      reply.send({ success: true, data });
    },
  );

  app.delete(
    "/:id",
    { preHandler: [verifyJWT, requireDriver] },
    async (request, reply) => {
      const params = redemptionIdSchema.parse(request.params);
      await invalidateRedemption(request.user.sub, params.id);
      reply.send({ success: true, data: { invalidated: true } });
    },
  );

  app.post("/scan", { preHandler: [verifyJWT, requirePartner] }, async (request, reply) => {
    const body = scanSchema.parse(request.body);
    const data = await confirmRedemptionByToken(body.qrToken, request.user.partnerId);
    reply.send({ success: true, data });
  });
}
