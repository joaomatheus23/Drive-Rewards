import bcrypt from "bcryptjs";
import crypto from "node:crypto";
import type { JwtPayload, UserRole } from "@driven-rewards/shared";
import { AUTH } from "@driven-rewards/utils";
import { AppError } from "../middleware/error-handler.js";
import { User, type UserDocument } from "../models/user.model.js";

const SALT_ROUNDS = 12;

export interface TokenPair {
  accessToken: string;
  refreshToken: string;
}

export interface SafeUser {
  _id: string;
  name: string;
  email: string;
  role: UserRole;
  points: number;
  level: string;
  vehicleType?: string;
  profilePhotoUrl?: string;
  vehicle?: {
    licensePlate?: string;
  };
}

export function toSafeUser(user: UserDocument): SafeUser {
  return {
    _id: user._id.toString(),
    name: user.name,
    email: user.email,
    role: user.role,
    points: user.points,
    level: user.level,
    vehicleType: user.vehicleType,
    profilePhotoUrl: user.profilePhotoUrl,
    vehicle: user.vehicle
      ? { licensePlate: user.vehicle.licensePlate }
      : undefined,
  };
}

export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, SALT_ROUNDS);
}

export async function verifyPassword(
  password: string,
  passwordHash: string,
): Promise<boolean> {
  return bcrypt.compare(password, passwordHash);
}

export function generateRefreshToken(): string {
  return crypto.randomBytes(48).toString("hex");
}

export function hashRefreshToken(token: string): string {
  return crypto.createHash("sha256").update(token).digest("hex");
}

export function buildJwtPayload(user: UserDocument): JwtPayload {
  return {
    sub: user._id.toString(),
    email: user.email,
    role: user.role,
    partnerId: user.partnerId?.toString(),
  };
}

export async function findUserByEmail(email: string): Promise<UserDocument | null> {
  return User.findOne({ email: email.toLowerCase().trim() }).select("+passwordHash");
}

export async function registerDriver(input: {
  name: string;
  email: string;
  password: string;
}): Promise<UserDocument> {
  const existing = await User.findOne({ email: input.email.toLowerCase().trim() });
  if (existing) {
    throw new AppError(409, "EMAIL_EXISTS", "This email is already registered");
  }

  const passwordHash = await hashPassword(input.password);

  return User.create({
    name: input.name.trim(),
    email: input.email.toLowerCase().trim(),
    passwordHash,
    role: "driver",
    points: 0,
    level: "bronze",
    isActive: true,
  });
}

export async function authenticateUser(
  email: string,
  password: string,
): Promise<UserDocument> {
  const user = await findUserByEmail(email);
  if (!user || !user.isActive) {
    throw new AppError(401, "INVALID_CREDENTIALS", "Incorrect email or password");
  }

  const valid = await verifyPassword(password, user.passwordHash);
  if (!valid) {
    throw new AppError(401, "INVALID_CREDENTIALS", "Incorrect email or password");
  }

  return user;
}

export async function persistRefreshToken(
  user: UserDocument,
  refreshToken: string,
): Promise<void> {
  const expiresAt = new Date();
  expiresAt.setDate(expiresAt.getDate() + 7);

  user.refreshTokenHash = hashRefreshToken(refreshToken);
  user.refreshTokenExpiresAt = expiresAt;
  user.lastLoginAt = new Date();
  await user.save();
}

export async function clearRefreshToken(userId: string): Promise<void> {
  await User.findByIdAndUpdate(userId, {
    $unset: { refreshTokenHash: 1, refreshTokenExpiresAt: 1 },
  });
}

export async function rotateRefreshToken(
  refreshToken: string,
): Promise<UserDocument> {
  const hash = hashRefreshToken(refreshToken);
  const user = await User.findOne({ refreshTokenHash: hash });

  if (!user || !user.isActive) {
    throw new AppError(401, "INVALID_REFRESH_TOKEN", "Session expired. Please sign in again");
  }

  if (!user.refreshTokenExpiresAt || user.refreshTokenExpiresAt < new Date()) {
    await clearRefreshToken(user._id.toString());
    throw new AppError(401, "REFRESH_TOKEN_EXPIRED", "Session expired. Please sign in again");
  }

  return user;
}
