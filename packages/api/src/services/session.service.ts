/**
 * Session service
 * Role: api
 * Entry: session route handlers
 * Exit: business logic for tracking, costs, points and anti-fraud
 */
import crypto from "node:crypto";
import type {
  AppendGpsRequest,
  CraReportRow,
  EndSessionRequest,
  IGpsPoint,
  ISession,
  SessionPlatform,
  SessionSummaryPeriod,
  StartSessionRequest,
  TripPurpose,
} from "@driven-rewards/shared";
import {
  haversineKm,
  levelFromPoints,
  pointsForKm,
  SESSION,
} from "@driven-rewards/utils";
import { AppError } from "../middleware/error-handler.js";
import { PointsLedger } from "../models/points-ledger.model.js";
import { Session, type SessionDocument } from "../models/session.model.js";
import { User, type UserDocument } from "../models/user.model.js";

const MS_PER_MINUTE = 60_000;

interface GpsInput {
  lat: number;
  lng: number;
  speed?: number;
  accuracy?: number;
  heading?: number;
  altitude?: number;
  recordedAt?: string;
}

function toSessionDto(doc: SessionDocument): ISession {
  return {
    _id: doc._id.toString(),
    userId: doc.userId.toString(),
    status: doc.status,
    platform: doc.platform,
    startedAt: doc.startedAt,
    endedAt: doc.endedAt,
    gpsPoints: doc.gpsPoints,
    distanceKm: doc.distanceKm,
    durationMinutes: doc.durationMinutes,
    grossEarnings: doc.grossEarnings,
    fuelCostCAD: doc.fuelCostCAD,
    depreciationCostCAD: doc.depreciationCostCAD,
    netProfitCAD: doc.netProfitCAD,
    profitPerKm: doc.profitPerKm,
    profitPerHour: doc.profitPerHour,
    pointsEarned: doc.pointsEarned,
    deviceId: doc.deviceId,
    tripHash: doc.tripHash,
    isDriver: doc.isDriver,
    fraudFlags: doc.fraudFlags,
    tripPurpose: doc.tripPurpose,
    craEligibleKm: doc.craEligibleKm,
    vehicleSnapshot: doc.vehicleSnapshot,
    isActive: doc.isActive,
    km: doc.km,
    points: doc.points,
    createdAt: doc.createdAt,
    updatedAt: doc.updatedAt,
  };
}

function buildVehicleSnapshot(user: UserDocument) {
  return {
    vehicleType: user.vehicleType,
    licensePlate: user.vehicle?.licensePlate,
    fuelConsumptionL100km:
      user.vehicle?.fuelConsumptionL100km ?? SESSION.DEFAULT_FUEL_L100KM,
    depreciationRatePerKm:
      user.vehicle?.depreciationRatePerKm ?? SESSION.DEFAULT_DEPRECIATION_PER_KM,
  };
}

function generateTripHash(userId: string, deviceId: string): string {
  const seed = `${userId}:${deviceId}:${Date.now()}:${crypto.randomBytes(8).toString("hex")}`;
  return crypto.createHash("sha256").update(seed).digest("hex");
}

function speedKmh(point: GpsInput): number {
  if (point.speed == null) return 0;
  return point.speed > 25 ? point.speed : point.speed * 3.6;
}

function isValidGpsPoint(point: GpsInput, previous?: IGpsPoint): boolean {
  if (point.accuracy != null && point.accuracy > SESSION.MAX_GPS_ACCURACY_METERS) {
    return false;
  }

  const currentSpeed = speedKmh(point);
  if (currentSpeed > SESSION.MAX_SPEED_KMH) {
    return false;
  }

  if (previous) {
    const elapsedHours =
      (new Date(point.recordedAt ?? Date.now()).getTime() -
        new Date(previous.recordedAt).getTime()) /
      3_600_000;
    if (elapsedHours > 0) {
      const distance = haversineKm(previous, point);
      const impliedSpeed = distance / elapsedHours;
      if (impliedSpeed > SESSION.MAX_SPEED_KMH) {
        return false;
      }
    }
  }

  return true;
}

function calculateFuelCost(distanceKm: number, fuelL100km: number): number {
  const liters = (distanceKm / 100) * fuelL100km;
  return Number((liters * SESSION.DEFAULT_FUEL_PRICE_CAD).toFixed(2));
}

function calculateDepreciation(distanceKm: number, ratePerKm: number): number {
  return Number((distanceKm * ratePerKm).toFixed(2));
}

function calculateDurationMinutes(startedAt: Date, endedAt: Date): number {
  return Math.max(0, Math.round((endedAt.getTime() - startedAt.getTime()) / MS_PER_MINUTE));
}

function craEligibleKmForPurpose(distanceKm: number, purpose: TripPurpose): number {
  if (purpose === "personal") return 0;
  if (purpose === "work") return distanceKm;
  return Number((distanceKm * 0.5).toFixed(2));
}

async function getDailyPointsEarned(userId: string): Promise<number> {
  const startOfDay = new Date();
  startOfDay.setHours(0, 0, 0, 0);

  const sessions = await Session.find({
    userId,
    startedAt: { $gte: startOfDay },
    status: "completed",
  }).select("pointsEarned");

  return sessions.reduce((sum, session) => sum + session.pointsEarned, 0);
}

function capPointsForDay(requested: number, alreadyEarned: number): number {
  const remaining = Math.max(0, SESSION.DAILY_POINTS_CAP - alreadyEarned);
  return Math.min(requested, remaining);
}

async function findOwnedSession(
  sessionId: string,
  userId: string,
): Promise<SessionDocument> {
  const session = await Session.findOne({ _id: sessionId, userId });
  if (!session) {
    throw new AppError(404, "SESSION_NOT_FOUND", "Session not found");
  }
  return session;
}

export async function startSession(
  userId: string,
  input: StartSessionRequest,
): Promise<ISession> {
  const user = await User.findById(userId);
  if (!user) {
    throw new AppError(404, "USER_NOT_FOUND", "User not found");
  }

  const existing = await Session.findOne({
    userId,
    status: { $in: ["active", "paused"] },
  });
  if (existing) {
    throw new AppError(409, "SESSION_ALREADY_ACTIVE", "An active session already exists");
  }

  const tripHash = generateTripHash(userId, input.deviceId);
  const session = await Session.create({
    userId,
    status: "active",
    platform: input.platform ?? "manual",
    startedAt: new Date(),
    grossEarnings: input.grossEarnings ?? 0,
    deviceId: input.deviceId,
    tripHash,
    vehicleSnapshot: buildVehicleSnapshot(user),
    isActive: true,
  });

  return toSessionDto(session);
}

export async function appendGpsPoints(
  sessionId: string,
  userId: string,
  input: AppendGpsRequest,
): Promise<{ session: ISession; accepted: number; rejected: number }> {
  const session = await findOwnedSession(sessionId, userId);

  if (session.status !== "active") {
    throw new AppError(400, "SESSION_NOT_ACTIVE", "Session is not actively tracking");
  }

  if (input.points.length > SESSION.GPS_BATCH_MAX) {
    throw new AppError(400, "GPS_BATCH_TOO_LARGE", "Maximum 20 GPS points per request");
  }

  let accepted = 0;
  let rejected = 0;
  const fraudFlags = new Set(session.fraudFlags);
  let lastPoint = session.gpsPoints[session.gpsPoints.length - 1];

  for (const raw of input.points) {
    if (!isValidGpsPoint(raw, lastPoint)) {
      rejected += 1;
      fraudFlags.add("invalid_gps_point");
      continue;
    }

    const point: IGpsPoint = {
      lat: raw.lat,
      lng: raw.lng,
      speed: raw.speed,
      accuracy: raw.accuracy,
      heading: raw.heading,
      altitude: raw.altitude,
      recordedAt: raw.recordedAt ? new Date(raw.recordedAt) : new Date(),
    };

    if (lastPoint) {
      session.distanceKm += haversineKm(lastPoint, point);
      session.km = session.distanceKm;
    }

    session.gpsPoints.push(point);
    lastPoint = point;
    accepted += 1;
  }

  session.distanceKm = Number(session.distanceKm.toFixed(3));
  session.km = session.distanceKm;
  session.fraudFlags = Array.from(fraudFlags);

  const provisionalPoints = pointsForKm(session.distanceKm);
  const dailyEarned = await getDailyPointsEarned(userId);
  session.pointsEarned = capPointsForDay(provisionalPoints, dailyEarned);
  session.points = session.pointsEarned;

  const fuelCost = calculateFuelCost(
    session.distanceKm,
    session.vehicleSnapshot.fuelConsumptionL100km,
  );
  const depreciationCost = calculateDepreciation(
    session.distanceKm,
    session.vehicleSnapshot.depreciationRatePerKm,
  );
  session.fuelCostCAD = fuelCost;
  session.depreciationCostCAD = depreciationCost;
  session.netProfitCAD = Number(
    (session.grossEarnings - fuelCost - depreciationCost).toFixed(2),
  );
  session.profitPerKm =
    session.distanceKm > 0
      ? Number((session.netProfitCAD / session.distanceKm).toFixed(2))
      : 0;
  session.durationMinutes = calculateDurationMinutes(session.startedAt, new Date());
  session.profitPerHour =
    session.durationMinutes > 0
      ? Number(((session.netProfitCAD / session.durationMinutes) * 60).toFixed(2))
      : 0;

  await session.save();

  return { session: toSessionDto(session), accepted, rejected };
}

export async function pauseSession(sessionId: string, userId: string): Promise<ISession> {
  const session = await findOwnedSession(sessionId, userId);
  if (session.status !== "active") {
    throw new AppError(400, "SESSION_NOT_ACTIVE", "Only active sessions can be paused");
  }
  session.status = "paused";
  session.isActive = true;
  await session.save();
  return toSessionDto(session);
}

export async function resumeSession(sessionId: string, userId: string): Promise<ISession> {
  const session = await findOwnedSession(sessionId, userId);
  if (session.status !== "paused") {
    throw new AppError(400, "SESSION_NOT_PAUSED", "Only paused sessions can be resumed");
  }
  session.status = "active";
  session.isActive = true;
  await session.save();
  return toSessionDto(session);
}

export async function endSession(
  sessionId: string,
  userId: string,
  input: EndSessionRequest,
): Promise<ISession> {
  const session = await findOwnedSession(sessionId, userId);
  if (session.status === "completed") {
    throw new AppError(400, "SESSION_ALREADY_ENDED", "Session already completed");
  }

  const endedAt = new Date();
  session.status = "completed";
  session.isActive = false;
  session.endedAt = endedAt;
  session.grossEarnings = input.grossEarnings;
  session.tripPurpose = input.tripPurpose;
  session.durationMinutes = calculateDurationMinutes(session.startedAt, endedAt);
  session.craEligibleKm = craEligibleKmForPurpose(session.distanceKm, input.tripPurpose);

  session.fuelCostCAD = calculateFuelCost(
    session.distanceKm,
    session.vehicleSnapshot.fuelConsumptionL100km,
  );
  session.depreciationCostCAD = calculateDepreciation(
    session.distanceKm,
    session.vehicleSnapshot.depreciationRatePerKm,
  );
  session.netProfitCAD = Number(
    (session.grossEarnings - session.fuelCostCAD - session.depreciationCostCAD).toFixed(2),
  );
  session.profitPerKm =
    session.distanceKm > 0
      ? Number((session.netProfitCAD / session.distanceKm).toFixed(2))
      : 0;
  session.profitPerHour =
    session.durationMinutes > 0
      ? Number(((session.netProfitCAD / session.durationMinutes) * 60).toFixed(2))
      : 0;

  const rawPoints = pointsForKm(session.distanceKm);
  const dailyEarned = await getDailyPointsEarned(userId);
  session.pointsEarned = capPointsForDay(rawPoints, dailyEarned);
  session.points = session.pointsEarned;

  await session.save();

  const user = await User.findById(userId);
  if (!user) {
    throw new AppError(404, "USER_NOT_FOUND", "User not found");
  }

  if (session.pointsEarned > 0) {
    user.points += session.pointsEarned;
    user.level = levelFromPoints(user.points);
    await user.save();

    await PointsLedger.create({
      userId,
      type: "session",
      amount: session.pointsEarned,
      balanceAfter: user.points,
      reference: { model: "Session", id: session._id },
      description: `Session ${session.distanceKm.toFixed(1)} km`,
    });
  }

  return toSessionDto(session);
}

export async function listSessions(
  userId: string,
  page: number,
  limit: number,
  status?: string,
): Promise<{ items: ISession[]; total: number; page: number; limit: number; totalPages: number }> {
  const filter: Record<string, unknown> = { userId };
  if (status) filter.status = status;

  const skip = (page - 1) * limit;
  const [items, total] = await Promise.all([
    Session.find(filter).sort({ startedAt: -1 }).skip(skip).limit(limit),
    Session.countDocuments(filter),
  ]);

  return {
    items: items.map(toSessionDto),
    total,
    page,
    limit,
    totalPages: Math.ceil(total / limit) || 1,
  };
}

export async function getSessionById(sessionId: string, userId: string): Promise<ISession> {
  const session = await findOwnedSession(sessionId, userId);
  return toSessionDto(session);
}

function aggregateSessions(sessions: SessionDocument[]): SessionSummaryPeriod {
  return sessions.reduce<SessionSummaryPeriod>(
    (acc, session) => ({
      totalKm: Number((acc.totalKm + session.distanceKm).toFixed(2)),
      totalMinutes: acc.totalMinutes + session.durationMinutes,
      totalPoints: acc.totalPoints + session.pointsEarned,
      totalNetProfitCAD: Number((acc.totalNetProfitCAD + session.netProfitCAD).toFixed(2)),
      sessionCount: acc.sessionCount + 1,
    }),
    {
      totalKm: 0,
      totalMinutes: 0,
      totalPoints: 0,
      totalNetProfitCAD: 0,
      sessionCount: 0,
    },
  );
}

export async function getTodaySummary(userId: string): Promise<SessionSummaryPeriod> {
  const start = new Date();
  start.setHours(0, 0, 0, 0);
  const sessions = await Session.find({
    userId,
    status: "completed",
    startedAt: { $gte: start },
  });
  return aggregateSessions(sessions);
}

export async function getWeekSummary(
  userId: string,
): Promise<SessionSummaryPeriod & { daily: Array<SessionSummaryPeriod & { date: string }> }> {
  const start = new Date();
  start.setDate(start.getDate() - 6);
  start.setHours(0, 0, 0, 0);

  const sessions = await Session.find({
    userId,
    status: "completed",
    startedAt: { $gte: start },
  }).sort({ startedAt: 1 });

  const dailyMap = new Map<string, SessionDocument[]>();
  for (const session of sessions) {
    const key = session.startedAt.toISOString().slice(0, 10);
    const bucket = dailyMap.get(key) ?? [];
    bucket.push(session);
    dailyMap.set(key, bucket);
  }

  const daily = Array.from(dailyMap.entries()).map(([date, daySessions]) => ({
    date,
    ...aggregateSessions(daySessions),
  }));

  return {
    ...aggregateSessions(sessions),
    daily,
  };
}

export async function getCraReport(
  userId: string,
  from?: string,
  to?: string,
): Promise<CraReportRow[]> {
  const filter: Record<string, unknown> = {
    userId,
    status: "completed",
  };

  if (from || to) {
    filter.startedAt = {};
    if (from) (filter.startedAt as Record<string, Date>).$gte = new Date(from);
    if (to) (filter.startedAt as Record<string, Date>).$lte = new Date(to);
  }

  const sessions = await Session.find(filter).sort({ startedAt: -1 });

  return sessions.map((session) => ({
    date: session.startedAt.toISOString().slice(0, 10),
    distanceKm: session.distanceKm,
    craEligibleKm: session.craEligibleKm,
    fuelCostCAD: session.fuelCostCAD,
    depreciationCostCAD: session.depreciationCostCAD,
    netProfitCAD: session.netProfitCAD,
    tripPurpose: session.tripPurpose ?? "work",
    platform: session.platform as SessionPlatform | undefined,
  }));
}

export async function getActiveSession(userId: string): Promise<ISession | null> {
  const session = await Session.findOne({
    userId,
    status: { $in: ["active", "paused"] },
  }).sort({ startedAt: -1 });
  return session ? toSessionDto(session) : null;
}
