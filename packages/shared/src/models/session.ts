/** Driving platform source for a session */
export type SessionPlatform =
  | "uber"
  | "lyft"
  | "doordash"
  | "skip"
  | "ubereats"
  | "manual";

/** Session lifecycle status */
export type SessionStatus = "active" | "paused" | "completed";

/** CRA trip purpose classification */
export type TripPurpose = "work" | "personal" | "mixed";

/** GPS coordinate embedded inside a driving Session */
export interface IGpsPoint {
  lat: number;
  lng: number;
  speed?: number;
  accuracy?: number;
  heading?: number;
  altitude?: number;
  recordedAt: Date;
}

/** Vehicle snapshot captured at session start */
export interface ISessionVehicleSnapshot {
  vehicleType?: string;
  licensePlate?: string;
  fuelConsumptionL100km: number;
  depreciationRatePerKm: number;
}

/** Plain Session document shape */
export interface ISession {
  _id: string;
  userId: string;
  status: SessionStatus;
  platform?: SessionPlatform;
  startedAt: Date;
  endedAt?: Date;
  gpsPoints: IGpsPoint[];
  distanceKm: number;
  durationMinutes: number;
  grossEarnings: number;
  fuelCostCAD: number;
  depreciationCostCAD: number;
  netProfitCAD: number;
  profitPerKm: number;
  profitPerHour: number;
  pointsEarned: number;
  deviceId: string;
  tripHash: string;
  isDriver: boolean;
  fraudFlags: string[];
  tripPurpose?: TripPurpose;
  craEligibleKm: number;
  vehicleSnapshot: ISessionVehicleSnapshot;
  /** @deprecated use status === 'active' | 'paused' */
  isActive: boolean;
  /** @deprecated use distanceKm */
  km: number;
  /** @deprecated use pointsEarned */
  points: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface StartSessionRequest {
  platform?: SessionPlatform;
  grossEarnings?: number;
  deviceId: string;
}

export interface AppendGpsRequest {
  points: Array<{
    lat: number;
    lng: number;
    speed?: number;
    accuracy?: number;
    heading?: number;
    altitude?: number;
    recordedAt?: string;
  }>;
}

export interface EndSessionRequest {
  grossEarnings: number;
  tripPurpose: TripPurpose;
}

export interface SessionLiveStats {
  distanceKm: number;
  durationMinutes: number;
  pointsEarned: number;
  estimatedProfitCAD: number;
}

export interface SessionSummaryPeriod {
  totalKm: number;
  totalMinutes: number;
  totalPoints: number;
  totalNetProfitCAD: number;
  sessionCount: number;
}

export interface CraReportRow {
  date: string;
  distanceKm: number;
  craEligibleKm: number;
  fuelCostCAD: number;
  depreciationCostCAD: number;
  netProfitCAD: number;
  tripPurpose: TripPurpose;
  platform?: SessionPlatform;
}
