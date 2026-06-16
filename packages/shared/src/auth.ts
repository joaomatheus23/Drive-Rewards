import type { UserRole } from "@driven-rewards/shared";

/** Vehicle type selected during driver registration */
export type VehicleType =
  | "car"
  | "motorcycle"
  | "bike"
  | "van"
  | "scooter"
  | "walk";

/** Auth API response user shape (safe fields only) */
export interface AuthUser {
  _id: string;
  name: string;
  email: string;
  role: UserRole;
  points: number;
  level: string;
  vehicleType?: VehicleType;
  profilePhotoUrl?: string;
  vehicle?: {
    licensePlate?: string;
  };
}

/** Login / register response */
export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
  user: AuthUser;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  name: string;
  email: string;
  password: string;
}

export interface UpdateProfileRequest {
  vehicleType?: VehicleType;
  licensePlate?: string;
  profilePhotoUrl?: string;
}
