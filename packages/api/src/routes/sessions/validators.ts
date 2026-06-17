/**
 * Session route validators
 * Role: api
 * Entry: session HTTP handlers
 * Exit: parsed and validated request payloads
 */
import { z } from "zod";

const platformEnum = z.enum(["uber", "lyft", "doordash", "skip", "ubereats", "manual"]);
const tripPurposeEnum = z.enum(["work", "personal", "mixed"]);

export const startSessionSchema = z.object({
  platform: platformEnum.optional(),
  grossEarnings: z.number().min(0).optional(),
  deviceId: z.string().min(3).max(120),
});

export const appendGpsSchema = z.object({
  points: z
    .array(
      z.object({
        lat: z.number().min(-90).max(90),
        lng: z.number().min(-180).max(180),
        speed: z.number().min(0).optional(),
        accuracy: z.number().min(0).optional(),
        heading: z.number().min(0).max(360).optional(),
        altitude: z.number().optional(),
        recordedAt: z.string().optional(),
      }),
    )
    .min(1)
    .max(20),
});

export const endSessionSchema = z.object({
  grossEarnings: z.number().min(0),
  tripPurpose: tripPurposeEnum,
});

export const listSessionsSchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(20),
  status: z.enum(["active", "paused", "completed"]).optional(),
});

export const craReportSchema = z.object({
  from: z.string().optional(),
  to: z.string().optional(),
});

export const sessionIdParamsSchema = z.object({
  id: z.string().min(1),
});
