/**
 * Session route handlers
 * Role: api
 * Entry: Fastify session routes
 * Exit: JSON responses for session operations
 */
import type { FastifyInstance } from "fastify";
import {
  appendGpsPoints,
  endSession,
  getActiveSession,
  getCraReport,
  getSessionById,
  getTodaySummary,
  getWeekSummary,
  listSessions,
  pauseSession,
  resumeSession,
  startSession,
} from "../../services/session.service.js";
import {
  appendGpsSchema,
  craReportSchema,
  endSessionSchema,
  listSessionsSchema,
  sessionIdParamsSchema,
  startSessionSchema,
} from "./validators.js";

export async function registerSessionHandlers(app: FastifyInstance): Promise<void> {
  app.get("/summary/today", async (request, reply) => {
    const data = await getTodaySummary(request.user.sub);
    reply.send({ success: true, data });
  });

  app.get("/summary/week", async (request, reply) => {
    const data = await getWeekSummary(request.user.sub);
    reply.send({ success: true, data });
  });

  app.get("/report/cra", async (request, reply) => {
    const query = craReportSchema.parse(request.query);
    const data = await getCraReport(request.user.sub, query.from, query.to);
    reply.send({ success: true, data });
  });

  app.get("/active", async (request, reply) => {
    const data = await getActiveSession(request.user.sub);
    reply.send({ success: true, data });
  });

  app.get("/", async (request, reply) => {
    const query = listSessionsSchema.parse(request.query);
    const data = await listSessions(
      request.user.sub,
      query.page,
      query.limit,
      query.status,
    );
    reply.send({ success: true, data });
  });

  app.get("/:id", async (request, reply) => {
    const params = sessionIdParamsSchema.parse(request.params);
    const data = await getSessionById(params.id, request.user.sub);
    reply.send({ success: true, data });
  });

  app.post("/start", async (request, reply) => {
    const body = startSessionSchema.parse(request.body);
    const data = await startSession(request.user.sub, body);
    reply.status(201).send({ success: true, data });
  });

  app.post("/:id/gps", async (request, reply) => {
    const params = sessionIdParamsSchema.parse(request.params);
    const body = appendGpsSchema.parse(request.body);
    const data = await appendGpsPoints(params.id, request.user.sub, body);
    reply.send({ success: true, data });
  });

  app.post("/:id/pause", async (request, reply) => {
    const params = sessionIdParamsSchema.parse(request.params);
    const data = await pauseSession(params.id, request.user.sub);
    reply.send({ success: true, data });
  });

  app.post("/:id/resume", async (request, reply) => {
    const params = sessionIdParamsSchema.parse(request.params);
    const data = await resumeSession(params.id, request.user.sub);
    reply.send({ success: true, data });
  });

  app.post("/:id/end", async (request, reply) => {
    const params = sessionIdParamsSchema.parse(request.params);
    const body = endSessionSchema.parse(request.body);
    const data = await endSession(params.id, request.user.sub, body);
    reply.send({ success: true, data });
  });
}
