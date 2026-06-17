/** DriverOne Phase 2 — UI-facing product constants */
export const Product = {
  points: {
    perVerifiedKm: 1,
    dailyCap: 300,
    redemptionValueCad: 5,
    redemptionThresholdPts: 1000,
    inactivityExpiryMonths: 12,
    multiplierMin: 2,
    multiplierMax: 3,
  },
  cities: {
    launch: ["toronto", "winnipeg"] as const,
    primary: "toronto" as const,
  },
  partnerPlans: {
    standard: { priceCad: 99, commissionPct: 15 },
    plus: { priceCad: 249, commissionPct: 8 },
  },
} as const;

export type LaunchCity = (typeof Product.cities.launch)[number];
