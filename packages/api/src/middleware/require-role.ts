import type { FastifyRequest, FastifyReply } from "fastify";
import type { UserRole } from "@driven-rewards/shared";

/**
 * Role-based authorization middleware factory.
 * Usage: preHandler: [verifyJWT, requireRole("admin", "super_admin")]
 */
export function requireRole(...allowedRoles: UserRole[]) {
  return async function roleGuard(
    request: FastifyRequest,
    reply: FastifyReply,
  ): Promise<void> {
    const { role } = request.user;

    if (!allowedRoles.includes(role)) {
      reply.status(403).send({
        success: false,
        error: {
          code: "FORBIDDEN",
          message: `Role '${role}' is not authorized for this resource`,
        },
      });
    }
  };
}

/** Shorthand guards for common role groups */
export const requireDriver = requireRole("driver");
export const requirePartner = requireRole("partner_owner", "partner_staff");
export const requirePartnerOwner = requireRole("partner_owner");
export const requireAdmin = requireRole("admin", "super_admin");
export const requireSuperAdmin = requireRole("super_admin");
