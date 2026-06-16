import type { DriverLevel, UserRole } from "../index.js";

/** Plain User document shape (no Mongoose internals) */
export interface IUser {
  _id: string;
  name: string;
  email: string;
  passwordHash: string;
  role: UserRole;
  points: number;
  level: DriverLevel;
  vehicle?: {
    make?: string;
    model?: string;
    year?: number;
    licensePlate?: string;
  };
  fcmToken?: string;
  refreshTokenHash?: string;
  partnerId?: string;
  vehicleType?: "car" | "motorcycle" | "bike" | "van" | "scooter" | "walk";
  profilePhotoUrl?: string;
  isActive: boolean;
  lastLoginAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}
