import type { FastifyInstance } from "fastify";
import { authRoutes } from "./auth.routes.js";
import { userRoutes } from "./users.routes.js";
import { partnerRoutes } from "./partners.routes.js";
import { couponRoutes } from "./coupons.routes.js";
import { redemptionRoutes } from "./redemptions.routes.js";
import { sessionRoutes } from "./sessions/index.js";
import { routineRoutes } from "./routines.routes.js";
import { notificationRoutes } from "./notifications.routes.js";
import { adminRoutes } from "./admin.routes.js";

/** Register all domain routes under /api/v1 */
export async function registerRoutes(app: FastifyInstance): Promise<void> {
  app.register(
    async (api) => {
      api.get("/health", async () => ({
        success: true,
        data: { status: "ok", timestamp: new Date().toISOString() },
      }));

      api.register(authRoutes, { prefix: "/auth" });
      api.register(userRoutes, { prefix: "/users" });
      api.register(partnerRoutes, { prefix: "/partners" });
      api.register(couponRoutes, { prefix: "/coupons" });
      api.register(redemptionRoutes, { prefix: "/redemptions" });
      api.register(sessionRoutes, { prefix: "/sessions" });
      api.register(routineRoutes, { prefix: "/routines" });
      api.register(notificationRoutes, { prefix: "/notifications" });
      api.register(adminRoutes, { prefix: "/admin" });
    },
    { prefix: "/api/v1" },
  );
}
