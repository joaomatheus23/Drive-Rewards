import type { FastifyRequest, FastifyReply } from "fastify";
import type { JwtPayload } from "@driven-rewards/shared";

/** Extend Fastify request with authenticated user payload */
declare module "fastify" {
  interface FastifyRequest {
    user: JwtPayload;
  }
}

/**
 * Authentication middleware — verifies JWT from Authorization header.
 * Attaches decoded payload to request.user.
 */
export async function verifyJWT(
  request: FastifyRequest,
  reply: FastifyReply,
): Promise<void> {
  try {
    await request.jwtVerify();
  } catch {
    reply.status(401).send({
      success: false,
      error: {
        code: "UNAUTHORIZED",
        message: "Invalid or expired access token",
      },
    });
  }
}
