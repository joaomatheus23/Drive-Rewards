import { z } from "zod";
import type { FastifyInstance } from "fastify";
import { AppError } from "../middleware/error-handler.js";
import { verifyJWT } from "../middleware/verify-jwt.js";
import { requireRole } from "../middleware/require-role.js";
import { User } from "../models/user.model.js";
import { toSafeUser } from "../services/auth.service.js";

const profileSchema = z.object({
  vehicleType: z
    .enum(["car", "motorcycle", "bike", "van", "scooter", "walk"])
    .optional(),
  licensePlate: z.string().min(2).max(12).optional(),
  profilePhotoUrl: z.string().max(2048).optional(),
});

const fcmSchema = z.object({
  fcmToken: z.string().min(1),
});

/** User profile and driver-specific routes */
export async function userRoutes(app: FastifyInstance): Promise<void> {
  app.addHook("preHandler", verifyJWT);

  app.get("/me", async (request, reply) => {
    const user = await User.findById(request.user.sub);
    if (!user) {
      throw new AppError(404, "USER_NOT_FOUND", "User not found");
    }
    reply.send({ success: true, data: toSafeUser(user) });
  });

  app.patch("/me/profile", { preHandler: requireRole("driver") }, async (request, reply) => {
    const body = profileSchema.parse(request.body);
    const user = await User.findById(request.user.sub);

    if (!user) {
      throw new AppError(404, "USER_NOT_FOUND", "User not found");
    }

    if (body.vehicleType) user.vehicleType = body.vehicleType;
    if (body.licensePlate) {
      user.vehicle = {
        licensePlate: body.licensePlate.toUpperCase(),
      };
    }
    if (body.profilePhotoUrl !== undefined) {
      user.profilePhotoUrl = body.profilePhotoUrl || undefined;
    }

    await user.save();
    reply.send({ success: true, data: toSafeUser(user) });
  });

  app.patch(
    "/me/fcm-token",
    { preHandler: [requireRole("driver", "partner_staff")] },
    async (request, reply) => {
      const body = fcmSchema.parse(request.body);
      await User.findByIdAndUpdate(request.user.sub, { fcmToken: body.fcmToken });
      reply.send({ success: true, data: { updated: true } });
    },
  );
}
