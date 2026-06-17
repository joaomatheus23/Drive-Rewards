/** Smart Routine detection thresholds */
export const ROUTINE = {
  /** Minimum route repetitions before a routine is created */
  MIN_REPETITIONS: 3,
  /** Time window tolerance in minutes (±) */
  TIME_TOLERANCE_MINUTES: 20,
  /** Default geofence radius around partner on detected route (meters) */
  GEOFENCE_RADIUS_METERS: 500,
  /** Push notification lead time before reaching partner (minutes) */
  NOTIFICATION_LEAD_MINUTES: 5,
} as const;

/** Session tracking and anti-fraud */
export const SESSION = {
  POINTS_PER_VERIFIED_KM: 1,
  DAILY_POINTS_CAP: 300,
  MAX_SPEED_KMH: 250,
  MAX_GPS_ACCURACY_METERS: 100,
  DEFAULT_FUEL_PRICE_CAD: 1.65,
  DEFAULT_FUEL_L100KM: 8.5,
  DEFAULT_DEPRECIATION_PER_KM: 0.18,
  GPS_BATCH_MAX: 20,
} as const;

/** Points economy */
export const POINTS = {
  /** Points earned per km driven */
  PER_KM: 1,
  /** Level thresholds */
  LEVELS: {
    bronze: 0,
    silver: 1000,
    gold: 5000,
    platinum: 15000,
  },
} as const;

/** Winnipeg, MB default map center */
export const WINNIPEG_CENTER = {
  lat: 49.8954,
  lng: -97.1385,
} as const;

/** API pagination defaults */
export const PAGINATION = {
  DEFAULT_PAGE: 1,
  DEFAULT_LIMIT: 20,
  MAX_LIMIT: 100,
} as const;

/** JWT token lifetimes */
export const AUTH = {
  ACCESS_TOKEN_EXPIRY: "15m",
  REFRESH_TOKEN_EXPIRY: "7d",
} as const;
