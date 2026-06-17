/** Encodes a redemption token into a scannable deep-link payload. */
export function encodeRedemptionQrPayload(qrToken: string): string {
  return `drivenrewards://redeem?token=${encodeURIComponent(qrToken)}`;
}

/** Normalizes expo-router search params to a single string. */
export function routeParam(value: string | string[] | undefined): string {
  if (Array.isArray(value)) return value[0] ?? "";
  return value ?? "";
}
